-- merge_bilingual_rows
--
-- Collapses the bilingual row-per-language model into one row per SKU / per
-- content key, storing translatable text as JSONB `{en, he}`. Drops `lang`
-- columns. EN rows are canonical; HE rows are merged into the EN rows then
-- deleted. Drift on non-translatable fields is logged via RAISE NOTICE before
-- the HE row is dropped (EN wins per design). Also removes 11 site_content
-- keys that no code path references.
--
-- BREAKING. Ships together with the matching application code.

-- ----------------------------------------------------------------------------
-- 0. Assertions: no unexpected duplicates beyond the expected 1:1 per lang
-- ----------------------------------------------------------------------------
DO $assert$
DECLARE proj_dupe int; sc_dupe int;
BEGIN
  SELECT count(*) INTO proj_dupe
  FROM (SELECT 1 FROM projects GROUP BY "SKU", lang HAVING count(*) > 1) x;
  IF proj_dupe > 0 THEN
    RAISE EXCEPTION 'projects: % unexpected (SKU, lang) duplicates', proj_dupe;
  END IF;

  SELECT count(*) INTO sc_dupe
  FROM (SELECT 1 FROM site_content GROUP BY key, lang HAVING count(*) > 1) x;
  IF sc_dupe > 0 THEN
    RAISE EXCEPTION 'site_content: % unexpected (key, lang) duplicates', sc_dupe;
  END IF;
END
$assert$;

-- ----------------------------------------------------------------------------
-- 1. Drift audit (informational) — EN wins on every disagreement
-- ----------------------------------------------------------------------------
DO $audit$
DECLARE r record;
BEGIN
  FOR r IN
    WITH pairs AS (
      SELECT
        en."SKU" AS sku,
        en.priority         AS en_priority,          he.priority         AS he_priority,
        en.featured         AS en_featured,          he.featured         AS he_featured,
        en.status           AS en_status,            he.status           AS he_status,
        en.started_at       AS en_started,           he.started_at       AS he_started,
        en.finished_at      AS en_finished,          he.finished_at      AS he_finished,
        en.image            AS en_image,             he.image            AS he_image,
        en."imagePack"      AS en_pack,              he."imagePack"      AS he_pack,
        en.technologies     AS en_tech,              he.technologies     AS he_tech,
        en."projectType"    AS en_type,              he."projectType"    AS he_type,
        en.publish          AS en_pub,               he.publish          AS he_pub,
        en.settings         AS en_settings,          he.settings         AS he_settings,
        en.developers       AS en_devs,              he.developers       AS he_devs,
        en.assigned_manager AS en_mgr,               he.assigned_manager AS he_mgr,
        en.client_visibility AS en_cv,               he.client_visibility AS he_cv,
        en.dev_attribution  AS en_da,                he.dev_attribution  AS he_da,
        en."liveSite"->>'link'          AS en_ls_link,    he."liveSite"->>'link'          AS he_ls_link,
        en."liveSite"->'previewImage'   AS en_ls_pi,      he."liveSite"->'previewImage'   AS he_ls_pi,
        en.github->>'link'              AS en_gh_link,    he.github->>'link'              AS he_gh_link,
        en.github->'previewImage'       AS en_gh_pi,      he.github->'previewImage'       AS he_gh_pi
      FROM projects en
      LEFT JOIN projects he ON he."SKU" = en."SKU" AND he.lang = 'he'
      WHERE en.lang = 'en'
    )
    SELECT sku, 'priority' AS field, en_priority::text AS en_val, he_priority::text AS he_val
      FROM pairs WHERE en_priority IS DISTINCT FROM he_priority
    UNION ALL SELECT sku, 'featured',         en_featured::text,  he_featured::text  FROM pairs WHERE en_featured IS DISTINCT FROM he_featured
    UNION ALL SELECT sku, 'status',           en_status::text,    he_status::text    FROM pairs WHERE en_status IS DISTINCT FROM he_status
    UNION ALL SELECT sku, 'started_at',       en_started::text,   he_started::text   FROM pairs WHERE en_started IS DISTINCT FROM he_started
    UNION ALL SELECT sku, 'finished_at',      en_finished::text,  he_finished::text  FROM pairs WHERE en_finished IS DISTINCT FROM he_finished
    UNION ALL SELECT sku, 'image',            en_image,           he_image           FROM pairs WHERE en_image IS DISTINCT FROM he_image
    UNION ALL SELECT sku, 'imagePack',        en_pack::text,      he_pack::text      FROM pairs WHERE en_pack IS DISTINCT FROM he_pack
    UNION ALL SELECT sku, 'technologies',     en_tech::text,      he_tech::text      FROM pairs WHERE en_tech IS DISTINCT FROM he_tech
    UNION ALL SELECT sku, 'projectType',      en_type,            he_type            FROM pairs WHERE en_type IS DISTINCT FROM he_type
    UNION ALL SELECT sku, 'publish',          en_pub::text,       he_pub::text       FROM pairs WHERE en_pub IS DISTINCT FROM he_pub
    UNION ALL SELECT sku, 'settings',         en_settings::text,  he_settings::text  FROM pairs WHERE en_settings IS DISTINCT FROM he_settings
    UNION ALL SELECT sku, 'developers',       en_devs::text,      he_devs::text      FROM pairs WHERE en_devs IS DISTINCT FROM he_devs
    UNION ALL SELECT sku, 'assigned_manager', en_mgr::text,       he_mgr::text       FROM pairs WHERE en_mgr IS DISTINCT FROM he_mgr
    UNION ALL SELECT sku, 'client_visibility',en_cv::text,        he_cv::text        FROM pairs WHERE en_cv IS DISTINCT FROM he_cv
    UNION ALL SELECT sku, 'dev_attribution',  en_da::text,        he_da::text        FROM pairs WHERE en_da IS DISTINCT FROM he_da
    UNION ALL SELECT sku, 'liveSite.link',    en_ls_link,         he_ls_link         FROM pairs WHERE en_ls_link IS DISTINCT FROM he_ls_link
    UNION ALL SELECT sku, 'liveSite.previewImage', en_ls_pi::text, he_ls_pi::text    FROM pairs WHERE en_ls_pi IS DISTINCT FROM he_ls_pi
    UNION ALL SELECT sku, 'github.link',      en_gh_link,         he_gh_link         FROM pairs WHERE en_gh_link IS DISTINCT FROM he_gh_link
    UNION ALL SELECT sku, 'github.previewImage', en_gh_pi::text,  he_gh_pi::text     FROM pairs WHERE en_gh_pi IS DISTINCT FROM he_gh_pi
    ORDER BY sku, field
  LOOP
    RAISE NOTICE 'drift: SKU=% field=% en=% he=% (EN wins)', r.sku, r.field, r.en_val, r.he_val;
  END LOOP;
END
$audit$;

-- ----------------------------------------------------------------------------
-- 2. Add new JSONB columns
-- ----------------------------------------------------------------------------
ALTER TABLE projects
  ADD COLUMN title_i18n            jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb,
  ADD COLUMN description_i18n      jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb,
  ADD COLUMN long_description_i18n jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb,
  ADD COLUMN problem_i18n          jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb,
  ADD COLUMN what_i_built_i18n     jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb,
  ADD COLUMN how_it_works_i18n     jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb,
  ADD COLUMN result_i18n           jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb,
  ADD COLUMN company_name_i18n     jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb,
  ADD COLUMN duration_i18n         jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb;

ALTER TABLE site_content
  ADD COLUMN value_i18n jsonb NOT NULL DEFAULT '{"en":null,"he":null}'::jsonb;

-- ----------------------------------------------------------------------------
-- 3. Populate projects.*_i18n from EN+HE pairs (EN canonical row gets merged)
-- ----------------------------------------------------------------------------
WITH pairs AS (
  SELECT
    en.id AS en_id,
    jsonb_build_object('en', en.title,            'he', he.title)            AS v_title,
    jsonb_build_object('en', en.description,      'he', he.description)      AS v_desc,
    jsonb_build_object('en', en."longDescription",'he', he."longDescription")AS v_long,
    jsonb_build_object('en', en.problem,          'he', he.problem)          AS v_problem,
    jsonb_build_object('en', en.what_i_built,     'he', he.what_i_built)     AS v_built,
    jsonb_build_object('en', en.how_it_works,     'he', he.how_it_works)     AS v_how,
    jsonb_build_object('en', en.result,           'he', he.result)           AS v_result,
    jsonb_build_object('en', en.company_name,     'he', he.company_name)     AS v_company,
    jsonb_build_object('en', en.duration,         'he', he.duration)         AS v_duration
  FROM projects en
  LEFT JOIN projects he ON he."SKU" = en."SKU" AND he.lang = 'he'
  WHERE en.lang = 'en'
)
UPDATE projects p SET
  title_i18n            = pairs.v_title,
  description_i18n      = pairs.v_desc,
  long_description_i18n = pairs.v_long,
  problem_i18n          = pairs.v_problem,
  what_i_built_i18n     = pairs.v_built,
  how_it_works_i18n     = pairs.v_how,
  result_i18n           = pairs.v_result,
  company_name_i18n     = pairs.v_company,
  duration_i18n         = pairs.v_duration
FROM pairs
WHERE p.id = pairs.en_id;

-- Safety net: if any HE row has no EN counterpart, promote it (en stays null).
WITH he_only AS (
  SELECT he.id AS he_id
  FROM projects he
  WHERE he.lang = 'he'
    AND NOT EXISTS (SELECT 1 FROM projects en WHERE en."SKU" = he."SKU" AND en.lang = 'en')
)
UPDATE projects p SET
  title_i18n            = jsonb_build_object('en', NULL, 'he', p.title),
  description_i18n      = jsonb_build_object('en', NULL, 'he', p.description),
  long_description_i18n = jsonb_build_object('en', NULL, 'he', p."longDescription"),
  problem_i18n          = jsonb_build_object('en', NULL, 'he', p.problem),
  what_i_built_i18n     = jsonb_build_object('en', NULL, 'he', p.what_i_built),
  how_it_works_i18n     = jsonb_build_object('en', NULL, 'he', p.how_it_works),
  result_i18n           = jsonb_build_object('en', NULL, 'he', p.result),
  company_name_i18n     = jsonb_build_object('en', NULL, 'he', p.company_name),
  duration_i18n         = jsonb_build_object('en', NULL, 'he', p.duration)
WHERE p.id IN (SELECT he_id FROM he_only);

-- ----------------------------------------------------------------------------
-- 4. Rewrite translatable leaves inside existing JSONB columns
--    additionalInfo: [{label, value}] → [{label:{en,he}, value:{en,he}}]
--    liveSite/github: {label, subHeader} → {label:{en,he}, subHeader:{en,he}}
-- ----------------------------------------------------------------------------

-- 4a. additionalInfo (merge by array index; arrays are same length & order today)
WITH pairs AS (
  SELECT en.id AS en_id,
         COALESCE(en."additionalInfo", '[]'::jsonb) AS en_ai,
         COALESCE(he."additionalInfo", '[]'::jsonb) AS he_ai
  FROM projects en
  LEFT JOIN projects he ON he."SKU" = en."SKU" AND he.lang = 'he'
  WHERE en.lang = 'en'
),
merged AS (
  SELECT
    pairs.en_id,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'label', jsonb_build_object(
            'en', e.elem->>'label',
            'he', (pairs.he_ai -> (e.ord - 1)::int)->>'label'
          ),
          'value', jsonb_build_object(
            'en', e.elem->>'value',
            'he', (pairs.he_ai -> (e.ord - 1)::int)->>'value'
          )
        )
        ORDER BY e.ord
      )
      FROM jsonb_array_elements(pairs.en_ai) WITH ORDINALITY AS e(elem, ord)
    ) AS new_ai
  FROM pairs
)
UPDATE projects p
   SET "additionalInfo" = merged.new_ai
  FROM merged
 WHERE p.id = merged.en_id
   AND merged.new_ai IS NOT NULL;

-- 4b. liveSite (only rewrite when the EN row's liveSite is non-null)
WITH pairs AS (
  SELECT en.id AS en_id, en."liveSite" AS en_ls, he."liveSite" AS he_ls
  FROM projects en
  LEFT JOIN projects he ON he."SKU" = en."SKU" AND he.lang = 'he'
  WHERE en.lang = 'en'
)
UPDATE projects p
   SET "liveSite" = (p."liveSite" - 'label' - 'subHeader')
                    || jsonb_build_object(
                         'label',     jsonb_build_object('en', pairs.en_ls->>'label',     'he', pairs.he_ls->>'label'),
                         'subHeader', jsonb_build_object('en', pairs.en_ls->>'subHeader', 'he', pairs.he_ls->>'subHeader')
                       )
  FROM pairs
 WHERE p.id = pairs.en_id
   AND p."liveSite" IS NOT NULL;

-- 4c. github (same pattern)
WITH pairs AS (
  SELECT en.id AS en_id, en.github AS en_gh, he.github AS he_gh
  FROM projects en
  LEFT JOIN projects he ON he."SKU" = en."SKU" AND he.lang = 'he'
  WHERE en.lang = 'en'
)
UPDATE projects p
   SET github = (p.github - 'label' - 'subHeader')
                || jsonb_build_object(
                     'label',     jsonb_build_object('en', pairs.en_gh->>'label',     'he', pairs.he_gh->>'label'),
                     'subHeader', jsonb_build_object('en', pairs.en_gh->>'subHeader', 'he', pairs.he_gh->>'subHeader')
                   )
  FROM pairs
 WHERE p.id = pairs.en_id
   AND p.github IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 5. Populate site_content.value_i18n
-- ----------------------------------------------------------------------------
WITH pairs AS (
  SELECT en.id AS en_id,
         jsonb_build_object('en', en.value, 'he', he.value) AS v
  FROM site_content en
  LEFT JOIN site_content he ON he.key = en.key AND he.lang = 'he'
  WHERE en.lang = 'en'
)
UPDATE site_content sc
   SET value_i18n = pairs.v
  FROM pairs
 WHERE sc.id = pairs.en_id;

-- HE-only safety net (none today, but cheap)
WITH he_only AS (
  SELECT he.id AS he_id
  FROM site_content he
  WHERE he.lang = 'he'
    AND NOT EXISTS (SELECT 1 FROM site_content en WHERE en.key = he.key AND en.lang = 'en')
)
UPDATE site_content sc
   SET value_i18n = jsonb_build_object('en', NULL, 'he', sc.value)
 WHERE sc.id IN (SELECT he_id FROM he_only);

-- ----------------------------------------------------------------------------
-- 6. Delete the now-obsolete HE rows (canonical EN row holds the merged data)
-- ----------------------------------------------------------------------------
DELETE FROM projects     WHERE lang = 'he';
DELETE FROM site_content WHERE lang = 'he';

-- ----------------------------------------------------------------------------
-- 7. Drop old unique constraints (which include the `lang` column)
-- ----------------------------------------------------------------------------
ALTER TABLE projects     DROP CONSTRAINT IF EXISTS portfolio_sku_lang_unique;
ALTER TABLE site_content DROP CONSTRAINT IF EXISTS site_content_key_lang_key;

-- ----------------------------------------------------------------------------
-- 8. Drop the old scalar text columns and the `lang` column
-- ----------------------------------------------------------------------------
ALTER TABLE projects
  DROP COLUMN title,
  DROP COLUMN description,
  DROP COLUMN "longDescription",
  DROP COLUMN problem,
  DROP COLUMN what_i_built,
  DROP COLUMN how_it_works,
  DROP COLUMN result,
  DROP COLUMN company_name,
  DROP COLUMN duration,
  DROP COLUMN lang;

ALTER TABLE site_content
  DROP COLUMN value,
  DROP COLUMN lang;

-- ----------------------------------------------------------------------------
-- 9. Rename *_i18n columns to the original names
-- ----------------------------------------------------------------------------
ALTER TABLE projects
  RENAME COLUMN title_i18n TO title;
ALTER TABLE projects
  RENAME COLUMN description_i18n TO description;
ALTER TABLE projects
  RENAME COLUMN long_description_i18n TO "longDescription";
ALTER TABLE projects
  RENAME COLUMN problem_i18n TO problem;
ALTER TABLE projects
  RENAME COLUMN what_i_built_i18n TO what_i_built;
ALTER TABLE projects
  RENAME COLUMN how_it_works_i18n TO how_it_works;
ALTER TABLE projects
  RENAME COLUMN result_i18n TO result;
ALTER TABLE projects
  RENAME COLUMN company_name_i18n TO company_name;
ALTER TABLE projects
  RENAME COLUMN duration_i18n TO duration;

ALTER TABLE site_content
  RENAME COLUMN value_i18n TO value;

-- ----------------------------------------------------------------------------
-- 10. Drop the column defaults (we want the application to write explicit values)
-- ----------------------------------------------------------------------------
ALTER TABLE projects
  ALTER COLUMN title DROP DEFAULT,
  ALTER COLUMN description DROP DEFAULT,
  ALTER COLUMN "longDescription" DROP DEFAULT,
  ALTER COLUMN problem DROP DEFAULT,
  ALTER COLUMN what_i_built DROP DEFAULT,
  ALTER COLUMN how_it_works DROP DEFAULT,
  ALTER COLUMN result DROP DEFAULT,
  ALTER COLUMN company_name DROP DEFAULT,
  ALTER COLUMN duration DROP DEFAULT;

ALTER TABLE site_content
  ALTER COLUMN value DROP DEFAULT;

-- ----------------------------------------------------------------------------
-- 11. Replace unique constraints — now (SKU) / (key) only
-- ----------------------------------------------------------------------------
ALTER TABLE projects     ADD CONSTRAINT projects_sku_unique     UNIQUE ("SKU");
ALTER TABLE site_content ADD CONSTRAINT site_content_key_unique UNIQUE (key);

-- ----------------------------------------------------------------------------
-- 12. Drop unused site_content keys (verified by grep + dynamic-key audit)
-- ----------------------------------------------------------------------------
DELETE FROM site_content WHERE key IN (
  'contact.form.email',
  'contact.form.name',
  'contact.form.subject',
  'contact.form.message',
  'footer.contact',
  'footer.privacy',
  'footer.terms',
  'lang.toggle',
  'hero.badge',
  'hero.cta.primary',
  'hero.cta.secondary'
);

-- ----------------------------------------------------------------------------
-- 13. Post-migration verification
-- ----------------------------------------------------------------------------
DO $verify$
DECLARE proj_count int; sc_count int;
BEGIN
  SELECT count(*) INTO proj_count FROM projects;
  IF proj_count <> 12 THEN
    RAISE EXCEPTION 'projects post-merge expected 12 rows, got %', proj_count;
  END IF;

  SELECT count(*) INTO sc_count FROM site_content;
  IF sc_count <> 71 THEN
    RAISE EXCEPTION 'site_content post-merge expected 71 rows (82 - 11 unused), got %', sc_count;
  END IF;

  RAISE NOTICE 'merge_bilingual_rows: projects=%, site_content=%', proj_count, sc_count;
END
$verify$;

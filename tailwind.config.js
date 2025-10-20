/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", "class"],

  theme: {
  	extend: {
  		colors: {
  			visara: {
  				light: {
  					primary: '#000000',
  					secondary: '#666666',
  					tertiary: '#d1d1d1ff',
  					accent: '#0066FF',
  					background: '#FAFAFA',
  					surface: '#FFFFFF',
  					surfaceSecondary: '#eaeaeaff',
  					backgroundAccent: '#4b93ffff',
  					overlay: 'rgba(0, 0, 0, 0.5)',
  					text: '#333333',
  					textSecondary: '#666666',
  					textTertiary: '#999999',
  					textInverse: '#FFFFFF',
  					border: '#E5E5E7',
  					borderLight: '#F0F0F0',
  					success: '#34C759',
  					error: '#FF3B30',
  					warning: '#FF9500',
  					info: '#0066FF',
  					userMessage: '#007AFF',
  					aiMessage: '#F2F2F7',
  					skeleton: '#F0F0F0',
  					shadow: '#000000'
  				},
  				dark: {
  					primary: '#FFFFFF',
  					secondary: '#AAAAAA',
  					tertiary: '#4a4a4aff',
  					accent: '#0A84FF',
  					background: '#000000',
  					surface: '#111111ff',
  					surfaceSecondary: '#1c1c1cff',
  					backgroundAccent: '#002967ff',
  					overlay: 'rgba(0, 0, 0, 0.8)',
  					text: '#FFFFFF',
  					textSecondary: '#AAAAAAB3',
  					textTertiary: '#AAAAAA66',
  					textInverse: '#000000',
  					border: '#38383A',
  					borderLight: '#48484A',
  					success: '#30D158',
  					error: '#FF453A',
  					warning: '#FF9F0A',
  					info: '#0A84FF',
  					userMessage: '#0A84FF',
  					aiMessage: '#2C2C2E',
  					skeleton: '#2C2C2E',
  					shadow: '#000000'
  				}
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			fadeIn: 'fadeIn 0.5s ease-in-out',
  			fadeOut: 'fadeOut 0.5s ease-in-out',
  			slideInRight: 'slideInRight 0.5s ease-in-out',
  			slideInLeft: 'slideInLeft 0.5s ease-in-out',
  			slideInUp: 'slideInUp 0.5s ease-in-out',
  			slideInDown: 'slideInDown 0.5s ease-in-out',
  			pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			fadeOut: {
  				'0%': {
  					opacity: '1'
  				},
  				'100%': {
  					opacity: '0'
  				}
  			},
  			slideInRight: {
  				'0%': {
  					transform: 'translateX(100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			slideInLeft: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			slideInUp: {
  				'0%': {
  					transform: 'translateY(100%)'
  				},
  				'100%': {
  					transform: 'translateY(0)'
  				}
  			},
  			slideInDown: {
  				'0%': {
  					transform: 'translateY(-100%)'
  				},
  				'100%': {
  					transform: 'translateY(0)'
  				}
  			},
  			pulse: {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.5'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

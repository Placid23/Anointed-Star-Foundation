
import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
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
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
        'quick-twinkle': { // Continuous for logo
          '0%, 48%, 53%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
          '51.5%': { opacity: '1', transform: 'scale(1.03)' },
        },
        'icon-bounce': { // For Home, MapPin on hover
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-4px) scale(1.1)' },
        },
        'icon-shake': { // For Info, Newspaper, FileText on hover
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-1.5px) rotate(-3deg) scale(1.05)' },
          '75%': { transform: 'translateX(1.5px) rotate(3deg) scale(1.05)' },
        },
        'icon-float': { // For LifeBuoy on hover (continuous while hovered)
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-3px) scale(1.05)' },
        },
        'icon-pulse-subtle': { // For TrendingUp, LayoutDashboard on hover
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        'icon-point-right': { // For LogIn, UserPlus on hover
          '0%, 100%': { transform: 'translateX(0) scale(1)' },
          '50%': { transform: 'translateX(3px) scale(1.1)' },
        },
        'icon-point-left': { // For LogOut on hover
          '0%, 100%': { transform: 'translateX(0) scale(1)' },
          '50%': { transform: 'translateX(-3px) scale(1.1)' },
        },
        'icon-handheart-beat': { // For HandHeart on hover
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '20%': { transform: 'scale(1.15) rotate(-5deg)' },
          '40%': { transform: 'scale(1.05) rotate(3deg)' },
          '60%': { transform: 'scale(1.2) rotate(-3deg)' },
          '80%': { transform: 'scale(1.1) rotate(2deg)' },
        },
        'lightbulb-glow-hover': { // For Lightbulb on hover
            '0%, 100%': { filter: 'drop-shadow(0 0 1px hsl(var(--primary)/0.6))', opacity: '0.7' },
            '50%': { filter: 'drop-shadow(0 0 4px hsl(var(--primary))) drop-shadow(0 0 8px hsl(var(--primary) / 0.5))', opacity: '1' }
        }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'quick-twinkle': 'quick-twinkle 4s infinite ease-in-out', // Continuous for logo
        'icon-bounce': 'icon-bounce 0.4s ease-in-out',
        'icon-shake': 'icon-shake 0.4s ease-in-out',
        'icon-float': 'icon-float 0.7s ease-in-out infinite alternate', // Continuous while parent hovered
        'icon-pulse-subtle': 'icon-pulse-subtle 0.4s ease-in-out',
        'icon-point-right': 'icon-point-right 0.3s ease-out',
        'icon-point-left': 'icon-point-left 0.3s ease-out',
        'icon-handheart-beat': 'icon-handheart-beat 0.6s ease-in-out',
        'lightbulb-glow-hover': 'lightbulb-glow-hover 0.8s ease-in-out forwards', // `forwards` keeps the end state
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

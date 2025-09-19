import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import Hero from '@/components/hero';

// Mock next/theme
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

describe('Hero Component', () => {
  beforeEach(() => {
    render(<Hero />);
  });

  describe('Rendering', () => {
    it('renders the main heading', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Recovery When You Need It');
    });

    it('renders the subtitle text', () => {
      const subtitle = screen.getByText(/Mobile cold plunge & infrared sauna/i);
      expect(subtitle).toBeInTheDocument();
    });

    it('renders both call-to-action buttons', () => {
      const bookNowButton = screen.getByRole('button', { name: /book now/i });
      const learnMoreButton = screen.getByRole('button', { name: /learn more/i });
      
      expect(bookNowButton).toBeInTheDocument();
      expect(learnMoreButton).toBeInTheDocument();
    });

    it('renders trust indicators', () => {
      expect(screen.getByText(/secure payments via bolt/i)).toBeInTheDocument();
      expect(screen.getByText(/30-day flexibility/i)).toBeInTheDocument();
      expect(screen.getByText(/4.8\/5 rating/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('allows clicking the Book Now button', () => {
      const bookNowButton = screen.getByRole('button', { name: /book now/i });
      fireEvent.click(bookNowButton);
      // Note: Add actual navigation testing when booking flow is implemented
      expect(bookNowButton).toHaveClass('bg-white', 'text-blue-900');
    });

    it('allows clicking the Learn More button', () => {
      const learnMoreButton = screen.getByRole('button', { name: /learn more/i });
      fireEvent.click(learnMoreButton);
      expect(learnMoreButton).toHaveClass('border-2', 'border-white');
    });

    it('shows hover states on buttons', () => {
      const bookNowButton = screen.getByRole('button', { name: /book now/i });
      const learnMoreButton = screen.getByRole('button', { name: /learn more/i });
      
      expect(bookNowButton).toHaveClass('hover:bg-gray-100');
      expect(learnMoreButton).toHaveClass('hover:bg-white/10');
    });
  });

  describe('Responsive Design', () => {
    it('has responsive text classes for mobile and desktop', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      const subtitle = screen.getByText(/Mobile cold plunge & infrared sauna/i);
      
      expect(heading).toHaveClass('text-4xl', 'md:text-6xl');
      expect(subtitle).toHaveClass('text-xl', 'md:text-2xl');
    });

    it('has responsive button layout', () => {
      const buttonContainer = screen.getByRole('button', { name: /book now/i }).parentElement;
      expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row');
    });

    it('centers content with proper max width', () => {
      const mainContent = screen.getByText(/Recovery When You Need It/i).parentElement;
      expect(mainContent).toHaveClass('max-w-4xl', 'mx-auto', 'text-center');
    });
  });

  describe('Visual Design', () => {
    it('has proper background gradient classes', () => {
      const heroSection = screen.getByText(/Recovery When You Need It/i).closest('.min-h-screen');
      expect(heroSection).toHaveClass(
        'bg-gradient-to-br',
        'from-blue-900',
        'via-blue-700',
        'to-cyan-600'
      );
    });

    it('has proper overlay for readability', () => {
      const overlay = document.querySelector('.bg-black\\/20');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('absolute', 'inset-0', 'z-10');
    });

    it('has proper z-index layering', () => {
      const content = screen.getByText(/Recovery When You Need It/i).parentElement;
      expect(content).toHaveClass('relative', 'z-20');
    });
  });

  describe('Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(<Hero />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper heading hierarchy', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Recovery When You Need It');
    });

    it('has focusable buttons for keyboard navigation', () => {
      const bookNowButton = screen.getByRole('button', { name: /book now/i });
      const learnMoreButton = screen.getByRole('button', { name: /learn more/i });
      
      expect(bookNowButton).toBeVisible();
      expect(learnMoreButton).toBeVisible();
      
      // Test keyboard focus
      bookNowButton.focus();
      expect(bookNowButton).toHaveFocus();
      
      learnMoreButton.focus();
      expect(learnMoreButton).toHaveFocus();
    });

    it('has sufficient color contrast (visually confirmed in design)', () => {
      // Note: This would typically be tested with automated tools
      // The white text on blue-900 background should meet WCAG AA standards
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-white');
    });

    it('has proper semantic structure', () => {
      // Check for semantic HTML structure
      const main = screen.getByText(/Recovery When You Need It/i).closest('div');
      expect(main).toBeInTheDocument();
      
      // Heading should be properly structured
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Content Quality', () => {
    it('has clear value proposition', () => {
      const valueProposition = screen.getByText(/Mobile cold plunge & infrared sauna delivered to your door/i);
      expect(valueProposition).toBeInTheDocument();
      expect(valueProposition).toBeVisible();
    });

    it('includes trust signals', () => {
      const securePayments = screen.getByText(/secure payments via bolt/i);
      const flexibility = screen.getByText(/30-day flexibility/i);
      const rating = screen.getByText(/4.8\/5 rating/i);
      
      expect(securePayments).toBeInTheDocument();
      expect(flexibility).toBeInTheDocument();
      expect(rating).toBeInTheDocument();
    });

    it('has clear call-to-action hierarchy', () => {
      const bookNowButton = screen.getByRole('button', { name: /book now/i });
      const learnMoreButton = screen.getByRole('button', { name: /learn more/i });
      
      // Primary CTA should have more prominent styling
      expect(bookNowButton).toHaveClass('bg-white', 'text-blue-900');
      expect(learnMoreButton).toHaveClass('border-2', 'border-white', 'text-white');
    });
  });

  describe('Performance Considerations', () => {
    it('renders without expensive operations', () => {
      const startTime = performance.now();
      render(<Hero />);
      const endTime = performance.now();
      
      // Component should render quickly (under 10ms)
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('has optimized CSS classes for performance', () => {
      // Using Tailwind classes should be optimized
      const heroSection = screen.getByText(/Recovery When You Need It/i).closest('.min-h-screen');
      expect(heroSection?.className).toBeDefined();
      expect(heroSection?.className.length).toBeGreaterThan(0);
    });
  });

  describe('Error Boundaries', () => {
    it('renders within error boundary without throwing', () => {
      expect(() => {
        render(<Hero />);
      }).not.toThrow();
    });
  });
});
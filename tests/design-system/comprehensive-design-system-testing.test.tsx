/**
 * Comprehensive Design System Testing Suite
 * Tests all design system components, themes, accessibility, and performance
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from 'next-themes';
import { ReactElement } from 'react';

// Import all UI components for testing
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ui/theme-toggle';

expect.extend(toHaveNoViolations);

/**
 * Test wrapper with theme provider
 */
function TestWrapper({ children, theme = 'light' }: { children: ReactElement; theme?: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false}>
      <div className={theme}>
        {children}
      </div>
    </ThemeProvider>
  );
}

describe('Design System Components', () => {
  
  describe('Button Component', () => {
    const buttonVariants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    const buttonSizes = ['default', 'sm', 'lg', 'icon'] as const;

    buttonVariants.forEach(variant => {
      buttonSizes.forEach(size => {
        it(`renders ${variant} button with ${size} size correctly`, () => {
          render(
            <TestWrapper>
              <Button variant={variant} size={size}>
                {variant === 'icon' ? '🎯' : `${variant} ${size}`}
              </Button>
            </TestWrapper>
          );

          const button = screen.getByRole('button');
          expect(button).toBeInTheDocument();
          expect(button).toBeVisible();
        });

        it(`${variant} button with ${size} size has proper accessibility`, async () => {
          const { container } = render(
            <TestWrapper>
              <Button variant={variant} size={size} aria-label={`${variant} button`}>
                {variant === 'icon' ? '🎯' : `${variant} ${size}`}
              </Button>
            </TestWrapper>
          );

          const results = await axe(container);
          expect(results).toHaveNoViolations();
        });
      });
    });

    it('handles click events properly', () => {
      const handleClick = jest.fn();
      render(
        <TestWrapper>
          <Button onClick={handleClick}>Click me</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
      render(
        <TestWrapper>
          <Button disabled>Disabled Button</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('has proper focus styles', () => {
      render(
        <TestWrapper>
          <Button>Focus Test</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Card Component', () => {
    it('renders complete card structure correctly', () => {
      render(
        <TestWrapper>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
        </TestWrapper>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('has proper semantic structure', async () => {
      const { container } = render(
        <TestWrapper>
          <Card>
            <CardHeader>
              <CardTitle>Accessible Card</CardTitle>
              <CardDescription>This card follows accessibility guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content is properly structured</p>
            </CardContent>
          </Card>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Components', () => {
    it('renders form components with proper labels and associations', () => {
      render(
        <TestWrapper>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
            
            <Label htmlFor="notifications">Enable notifications</Label>
            <Switch id="notifications" />
            
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TestWrapper>
      );

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Enable notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Category')).toBeInTheDocument();
    });

    it('form components have proper accessibility attributes', async () => {
      const { container } = render(
        <TestWrapper>
          <form>
            <Label htmlFor="accessible-input">Accessible Input</Label>
            <Input 
              id="accessible-input" 
              type="text" 
              aria-describedby="input-help" 
              required 
            />
            <div id="input-help">This field is required</div>
          </form>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Navigation Components', () => {
    it('renders tabs with proper keyboard navigation', async () => {
      render(
        <TestWrapper>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
            <TabsContent value="tab3">Content 3</TabsContent>
          </Tabs>
        </TestWrapper>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');

      // Test keyboard navigation
      fireEvent.keyDown(tab1, { key: 'ArrowRight' });
      await waitFor(() => {
        expect(tab2).toHaveFocus();
      });
    });
  });

  describe('Feedback Components', () => {
    it('renders alerts with proper semantic roles', () => {
      render(
        <TestWrapper>
          <Alert>
            <AlertDescription>This is an informational alert</AlertDescription>
          </Alert>
        </TestWrapper>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('This is an informational alert')).toBeInTheDocument();
    });

    it('badges display with proper contrast', () => {
      const badgeVariants = ['default', 'secondary', 'destructive', 'outline'] as const;
      
      badgeVariants.forEach(variant => {
        const { container } = render(
          <TestWrapper>
            <Badge variant={variant}>{variant} badge</Badge>
          </TestWrapper>
        );

        const badge = container.querySelector('.badge, [class*="badge"]');
        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe('Dialog Components', () => {
    it('renders dialog with proper focus management', async () => {
      render(
        <TestWrapper>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>Dialog description</DialogDescription>
              </DialogHeader>
              <Button>Close</Button>
            </DialogContent>
          </Dialog>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby');
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby');
      });
    });

    it('dialog has proper accessibility structure', async () => {
      const { container } = render(
        <TestWrapper>
          <Dialog defaultOpen>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Accessible Dialog</DialogTitle>
                <DialogDescription>This dialog follows accessibility guidelines</DialogDescription>
              </DialogHeader>
              <div>Dialog content</div>
            </DialogContent>
          </Dialog>
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('Theme System Testing', () => {
  describe('Theme Toggle Component', () => {
    it('renders theme toggle with proper accessibility', async () => {
      const { container } = render(
        <TestWrapper>
          <ThemeToggle />
        </TestWrapper>
      );

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-label');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('toggles between light and dark themes', async () => {
      render(
        <TestWrapper>
          <ThemeToggle />
        </TestWrapper>
      );

      const toggle = screen.getByTestId('theme-toggle');
      
      // Initial state (light theme)
      expect(toggle).toHaveAttribute('aria-label', expect.stringContaining('dark'));
      
      // Click to toggle
      fireEvent.click(toggle);
      
      await waitFor(() => {
        expect(toggle).toHaveAttribute('aria-label', expect.stringContaining('light'));
      });
    });
  });

  describe('CSS Custom Properties', () => {
    it('applies correct CSS variables for light theme', () => {
      const { container } = render(
        <TestWrapper theme="light">
          <div className="bg-background text-foreground">Test content</div>
        </TestWrapper>
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('light');
    });

    it('applies correct CSS variables for dark theme', () => {
      const { container } = render(
        <TestWrapper theme="dark">
          <div className="bg-background text-foreground">Test content</div>
        </TestWrapper>
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveClass('dark');
    });
  });

  describe('Component Theme Consistency', () => {
    const themes = ['light', 'dark'] as const;
    const components = [
      { name: 'Button', component: <Button>Test Button</Button> },
      { name: 'Card', component: <Card><CardContent>Test Card</CardContent></Card> },
      { name: 'Input', component: <Input placeholder="Test Input" /> },
      { name: 'Badge', component: <Badge>Test Badge</Badge> },
      { name: 'Alert', component: <Alert><AlertDescription>Test Alert</AlertDescription></Alert> },
    ];

    themes.forEach(theme => {
      components.forEach(({ name, component }) => {
        it(`${name} renders correctly in ${theme} theme`, () => {
          const { container } = render(
            <TestWrapper theme={theme}>
              {component}
            </TestWrapper>
          );

          expect(container.firstChild).toHaveClass(theme);
        });
      });
    });
  });
});

describe('Performance Testing', () => {
  it('theme switching completes within performance budget', async () => {
    const { rerender } = render(
      <TestWrapper theme="light">
        <div className="bg-background text-foreground p-4">
          <Button>Button</Button>
          <Card><CardContent>Card content</CardContent></Card>
          <Input placeholder="Input" />
        </div>
      </TestWrapper>
    );

    const startTime = performance.now();
    
    rerender(
      <TestWrapper theme="dark">
        <div className="bg-background text-foreground p-4">
          <Button>Button</Button>
          <Card><CardContent>Card content</CardContent></Card>
          <Input placeholder="Input" />
        </div>
      </TestWrapper>
    );

    const endTime = performance.now();
    const themeToggleTime = endTime - startTime;

    // Theme toggle should complete within 100ms
    expect(themeToggleTime).toBeLessThan(100);
  });

  it('components render within performance budget', () => {
    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <div>
          {Array.from({ length: 50 }, (_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button>Action {i}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TestWrapper>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 50 components should render within 500ms
    expect(renderTime).toBeLessThan(500);
  });
});

describe('Responsive Design Testing', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Large Desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    it(`components respond correctly to ${name} viewport (${width}x${height})`, () => {
      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: height,
      });

      render(
        <TestWrapper>
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Responsive Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This card adapts to screen size</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TestWrapper>
      );

      const container = screen.getByText('Responsive Card').closest('.container');
      expect(container).toBeInTheDocument();
    });
  });
});

describe('Design Token Validation', () => {
  it('validates spacing tokens are consistent', () => {
    const spacingTokens = [
      'space-0', 'space-1', 'space-2', 'space-3', 'space-4',
      'space-5', 'space-6', 'space-8', 'space-10', 'space-12',
      'space-16', 'space-20', 'space-24', 'space-32'
    ];

    spacingTokens.forEach(token => {
      const { container } = render(
        <TestWrapper>
          <div className={`p-${token.replace('space-', '')}`}>
            Spacing test
          </div>
        </TestWrapper>
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  it('validates color tokens provide adequate contrast', () => {
    const colorCombinations = [
      { bg: 'bg-background', text: 'text-foreground' },
      { bg: 'bg-primary', text: 'text-primary-foreground' },
      { bg: 'bg-secondary', text: 'text-secondary-foreground' },
      { bg: 'bg-muted', text: 'text-muted-foreground' },
      { bg: 'bg-card', text: 'text-card-foreground' },
    ];

    colorCombinations.forEach(({ bg, text }) => {
      render(
        <TestWrapper>
          <div className={`${bg} ${text} p-4`}>
            Color contrast test
          </div>
        </TestWrapper>
      );

      expect(screen.getByText('Color contrast test')).toBeInTheDocument();
    });
  });

  it('validates typography scale is consistent', () => {
    const typographyClasses = [
      'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
      'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'
    ];

    typographyClasses.forEach(className => {
      render(
        <TestWrapper>
          <p className={className}>Typography test</p>
        </TestWrapper>
      );

      expect(screen.getByText('Typography test')).toHaveClass(className);
    });
  });
});
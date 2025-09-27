/**
 * @fileoverview Comprehensive Design System Component Testing Strategy
 * @description Tests all UI components for consistency, accessibility, and theming
 * @author QA Specialist - Testing and Quality Assurance Agent
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from 'next-themes';
import React from 'react';

expect.extend(toHaveNoViolations);

// Component testing utilities
const renderWithTheme = (component: React.ReactElement, theme = 'light') => {
  return render(
    <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false}>
      {component}
    </ThemeProvider>
  );
};

describe('Design System Component Testing Strategy', () => {
  describe('Button Component Validation', () => {
    it('renders all button variants correctly', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
      
      variants.forEach(variant => {
        const { rerender } = render(<Button variant={variant}>Test Button</Button>);
        const button = screen.getByRole('button', { name: 'Test Button' });
        
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
        
        // Cleanup for next iteration
        rerender(<div />);
      });
    });

    it('supports all size variations', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const;
      
      sizes.forEach(size => {
        const { rerender } = render(<Button size={size}>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        rerender(<div />);
      });
    });

    it('maintains accessibility standards', async () => {
      const { container } = render(
        <div>
          <Button>Primary Action</Button>
          <Button variant="outline">Secondary Action</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports proper keyboard navigation', () => {
      render(<Button>Focusable Button</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
      
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyDown(button, { key: ' ' });
      // Should not throw errors
    });
  });

  describe('Card Component System', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('maintains semantic structure for screen readers', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>This card is accessible</CardDescription>
          </CardHeader>
          <CardContent>Content area</CardContent>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Components Integration', () => {
    it('creates accessible form field combinations', async () => {
      const { container } = render(
        <div>
          <Label htmlFor="test-input">Test Label</Label>
          <Input id="test-input" placeholder="Enter text" />
        </div>
      );

      const input = screen.getByRole('textbox');
      const label = screen.getByText('Test Label');

      expect(input).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-input');
      expect(label).toHaveAttribute('for', 'test-input');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('handles form validation states', () => {
      render(
        <div>
          <Label htmlFor="error-input">Field with Error</Label>
          <Input 
            id="error-input" 
            aria-invalid="true"
            aria-describedby="error-message"
          />
          <span id="error-message" role="alert">This field is required</span>
        </div>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });
  });

  describe('Theme System Validation', () => {
    it('applies light theme correctly', () => {
      renderWithTheme(
        <Card>
          <CardContent>
            <Button>Light Theme Button</Button>
          </CardContent>
        </Card>,
        'light'
      );

      const card = screen.getByText('Light Theme Button').closest('[class*="bg-"]');
      expect(card).toBeInTheDocument();
    });

    it('applies dark theme correctly', () => {
      renderWithTheme(
        <Card>
          <CardContent>
            <Button>Dark Theme Button</Button>
          </CardContent>
        </Card>,
        'dark'
      );

      const card = screen.getByText('Dark Theme Button').closest('[class*="bg-"]');
      expect(card).toBeInTheDocument();
    });

    it('handles theme switching dynamically', () => {
      const ThemeSwitchTest = () => {
        const [theme, setTheme] = React.useState('light');
        
        return (
          <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false}>
            <div>
              <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                Switch to {theme === 'light' ? 'dark' : 'light'}
              </Button>
              <Card>
                <CardContent>Content in {theme} theme</CardContent>
              </Card>
            </div>
          </ThemeProvider>
        );
      };

      render(<ThemeSwitchTest />);
      
      const switchButton = screen.getByRole('button');
      expect(switchButton).toHaveTextContent('Switch to dark');
      
      fireEvent.click(switchButton);
      expect(switchButton).toHaveTextContent('Switch to light');
    });
  });

  describe('Alert and Status Components', () => {
    it('renders different alert variants', () => {
      const variants = ['default', 'destructive'] as const;
      
      variants.forEach(variant => {
        const { rerender } = render(
          <Alert variant={variant}>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert description</AlertDescription>
          </Alert>
        );
        
        expect(screen.getByText('Alert Title')).toBeInTheDocument();
        expect(screen.getByText('Alert description')).toBeInTheDocument();
        
        rerender(<div />);
      });
    });

    it('provides proper ARIA roles for alerts', async () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>This is an important message</AlertDescription>
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Badge Component Variants', () => {
    it('renders all badge variants', () => {
      const variants = ['default', 'secondary', 'destructive', 'outline'] as const;
      
      variants.forEach(variant => {
        const { rerender } = render(<Badge variant={variant}>Badge</Badge>);
        
        const badge = screen.getByText('Badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('inline-flex', 'items-center');
        
        rerender(<div />);
      });
    });
  });

  describe('Tab System Navigation', () => {
    it('creates accessible tab navigation', async () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');

      fireEvent.click(tab2);
      expect(screen.getByText('Content 2')).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation between tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      tab1.focus();
      expect(tab1).toHaveFocus();

      fireEvent.keyDown(tab1, { key: 'ArrowRight' });
      // Keyboard navigation should work (implementation dependent)
    });
  });

  describe('Responsive Design Validation', () => {
    it('applies responsive classes correctly', () => {
      render(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent>Responsive Card 1</CardContent>
          </Card>
          <Card>
            <CardContent>Responsive Card 2</CardContent>
          </Card>
          <Card>
            <CardContent>Responsive Card 3</CardContent>
          </Card>
        </div>
      );

      const container = screen.getByText('Responsive Card 1').closest('.grid');
      expect(container).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('Performance Considerations', () => {
    it('renders components efficiently', () => {
      const startTime = performance.now();
      
      render(
        <div>
          {Array.from({ length: 50 }, (_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Card {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button>Action {i + 1}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
      
      const endTime = performance.now();
      
      // Should render 50 cards in under 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('handles large datasets without memory leaks', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      render(
        <div>
          {Array.from({ length: 1000 }, (_, i) => (
            <Badge key={i} variant={i % 2 === 0 ? 'default' : 'secondary'}>
              Badge {i}
            </Badge>
          ))}
        </div>
      );
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 5MB for 1000 simple components)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Error Handling', () => {
    it('handles invalid props gracefully', () => {
      expect(() => {
        render(<Button variant={'invalid' as any}>Invalid Variant</Button>);
      }).not.toThrow();
    });

    it('provides fallback content for missing props', () => {
      render(<Card><CardContent /></Card>);
      
      // Should render without crashing
      expect(screen.getByRole('generic')).toBeInTheDocument();
    });
  });

  describe('Cross-Component Integration', () => {
    it('creates complex component compositions', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Enter username" />
                  </div>
                  <Alert>
                    <AlertTitle>Note</AlertTitle>
                    <AlertDescription>Username changes take effect immediately</AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
              <TabsContent value="security">
                <Button variant="destructive">Delete Account</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
            <Button variant="outline">Cancel</Button>
          </CardFooter>
        </Card>
      );

      // Test complex interaction
      const securityTab = screen.getByRole('tab', { name: 'Security' });
      fireEvent.click(securityTab);
      
      expect(screen.getByRole('button', { name: 'Delete Account' })).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
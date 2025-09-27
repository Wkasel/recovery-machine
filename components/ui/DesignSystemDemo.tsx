"use client";

import { useState } from "react";
import { 
  Container, 
  VStack, 
  HStack, 
  Grid, 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Badge,
  Separator,
  ThemeToggle
} from "../index";
import { Input as EnhancedInput, PasswordInput } from "../ui/enhanced-input";
import { Button as EnhancedButton, IconButton } from "../ui/enhanced-button";
import { Search, Plus, Download, Mail, Lock, Eye } from "lucide-react";

export function DesignSystemDemo() {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Container size="7xl">
      <VStack gap="2xl" className="py-12">
        {/* Header */}
        <Card variant="elevated">
          <CardHeader>
            <HStack justify="between" align="center">
              <VStack gap="sm">
                <CardTitle size="3xl">Design System Demo</CardTitle>
                <p className="text-muted-foreground text-lg">
                  Comprehensive component library and design tokens
                </p>
              </VStack>
              <ThemeToggle />
            </HStack>
          </CardHeader>
        </Card>

        {/* Layout Components */}
        <Card variant="default">
          <CardHeader>
            <CardTitle size="2xl">Layout Components</CardTitle>
          </CardHeader>
          <CardContent>
            <VStack gap="xl">
              {/* Container Demo */}
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Container Variants</h3>
                <div className="space-y-4">
                  <Container size="sm" className="bg-muted p-4 rounded">
                    <p className="text-center text-sm">Small Container (max-w-sm)</p>
                  </Container>
                  <Container size="md" className="bg-muted p-4 rounded">
                    <p className="text-center text-sm">Medium Container (max-w-md)</p>
                  </Container>
                  <Container size="lg" className="bg-muted p-4 rounded">
                    <p className="text-center text-sm">Large Container (max-w-lg)</p>
                  </Container>
                </div>
              </VStack>

              <Separator />

              {/* Stack Demo */}
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Stack Components</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">VStack with different gaps:</p>
                    <HStack gap="lg">
                      <VStack gap="xs" className="bg-muted p-4 rounded">
                        <div className="w-12 h-6 bg-primary rounded"></div>
                        <div className="w-12 h-6 bg-primary rounded"></div>
                        <div className="w-12 h-6 bg-primary rounded"></div>
                        <p className="text-xs">gap-xs</p>
                      </VStack>
                      <VStack gap="md" className="bg-muted p-4 rounded">
                        <div className="w-12 h-6 bg-primary rounded"></div>
                        <div className="w-12 h-6 bg-primary rounded"></div>
                        <div className="w-12 h-6 bg-primary rounded"></div>
                        <p className="text-xs">gap-md</p>
                      </VStack>
                      <VStack gap="xl" className="bg-muted p-4 rounded">
                        <div className="w-12 h-6 bg-primary rounded"></div>
                        <div className="w-12 h-6 bg-primary rounded"></div>
                        <div className="w-12 h-6 bg-primary rounded"></div>
                        <p className="text-xs">gap-xl</p>
                      </VStack>
                    </HStack>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">HStack with alignment:</p>
                    <VStack gap="sm">
                      <HStack gap="md" align="start" className="bg-muted p-4 rounded h-16">
                        <div className="w-6 h-6 bg-primary rounded"></div>
                        <div className="w-6 h-8 bg-secondary rounded"></div>
                        <div className="w-6 h-4 bg-accent rounded"></div>
                        <p className="text-xs">align-start</p>
                      </HStack>
                      <HStack gap="md" align="center" className="bg-muted p-4 rounded h-16">
                        <div className="w-6 h-6 bg-primary rounded"></div>
                        <div className="w-6 h-8 bg-secondary rounded"></div>
                        <div className="w-6 h-4 bg-accent rounded"></div>
                        <p className="text-xs">align-center</p>
                      </HStack>
                    </VStack>
                  </div>
                </div>
              </VStack>

              <Separator />

              {/* Grid Demo */}
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Grid System</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Responsive Grid (3 columns):</p>
                    <Grid cols="3" gap="md" className="mb-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-muted p-4 rounded text-center text-sm">
                          Item {i + 1}
                        </div>
                      ))}
                    </Grid>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Grid with different gaps:</p>
                    <HStack gap="lg">
                      <div>
                        <Grid cols="2" gap="xs" className="mb-2">
                          <div className="bg-primary h-8 rounded"></div>
                          <div className="bg-primary h-8 rounded"></div>
                          <div className="bg-primary h-8 rounded"></div>
                          <div className="bg-primary h-8 rounded"></div>
                        </Grid>
                        <p className="text-xs text-center">gap-xs</p>
                      </div>
                      <div>
                        <Grid cols="2" gap="lg" className="mb-2">
                          <div className="bg-primary h-8 rounded"></div>
                          <div className="bg-primary h-8 rounded"></div>
                          <div className="bg-primary h-8 rounded"></div>
                          <div className="bg-primary h-8 rounded"></div>
                        </Grid>
                        <p className="text-xs text-center">gap-lg</p>
                      </div>
                    </HStack>
                  </div>
                </div>
              </VStack>
            </VStack>
          </CardContent>
        </Card>

        {/* Enhanced Button Components */}
        <Card variant="default">
          <CardHeader>
            <CardTitle size="2xl">Enhanced Button System</CardTitle>
          </CardHeader>
          <CardContent>
            <VStack gap="xl">
              {/* Button Variants */}
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Button Variants</h3>
                <HStack gap="md" wrap="wrap">
                  <EnhancedButton variant="primary">Primary</EnhancedButton>
                  <EnhancedButton variant="secondary">Secondary</EnhancedButton>
                  <EnhancedButton variant="outline">Outline</EnhancedButton>
                  <EnhancedButton variant="ghost">Ghost</EnhancedButton>
                  <EnhancedButton variant="destructive">Destructive</EnhancedButton>
                  <EnhancedButton variant="success">Success</EnhancedButton>
                  <EnhancedButton variant="warning">Warning</EnhancedButton>
                  <EnhancedButton variant="info">Info</EnhancedButton>
                </HStack>
              </VStack>

              <Separator />

              {/* Button Sizes */}
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Button Sizes</h3>
                <HStack gap="md" align="center" wrap="wrap">
                  <EnhancedButton size="xs">Extra Small</EnhancedButton>
                  <EnhancedButton size="sm">Small</EnhancedButton>
                  <EnhancedButton size="default">Default</EnhancedButton>
                  <EnhancedButton size="lg">Large</EnhancedButton>
                  <EnhancedButton size="xl">Extra Large</EnhancedButton>
                </HStack>
              </VStack>

              <Separator />

              {/* Button States */}
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Button States & Features</h3>
                <HStack gap="md" wrap="wrap">
                  <EnhancedButton 
                    startIcon={<Plus className="h-4 w-4" />}
                  >
                    With Start Icon
                  </EnhancedButton>
                  <EnhancedButton 
                    endIcon={<Download className="h-4 w-4" />}
                    variant="outline"
                  >
                    With End Icon
                  </EnhancedButton>
                  <EnhancedButton 
                    loading={loading}
                    loadingText="Processing..."
                    onClick={handleLoadingDemo}
                  >
                    {loading ? "Loading..." : "Click for Loading State"}
                  </EnhancedButton>
                  <IconButton 
                    icon={<Search className="h-4 w-4" />}
                    aria-label="Search"
                    variant="outline"
                  />
                  <EnhancedButton fullWidth className="max-w-xs">
                    Full Width Button
                  </EnhancedButton>
                </HStack>
              </VStack>
            </VStack>
          </CardContent>
        </Card>

        {/* Enhanced Input Components */}
        <Card variant="default">
          <CardHeader>
            <CardTitle size="2xl">Enhanced Input System</CardTitle>
          </CardHeader>
          <CardContent>
            <VStack gap="xl">
              {/* Input Variants */}
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Input Variants & States</h3>
                <Grid cols="2" gap="lg">
                  <VStack gap="md">
                    <EnhancedInput
                      label="Default Input"
                      placeholder="Enter text..."
                      helperText="This is helper text"
                    />
                    <EnhancedInput
                      label="With Start Icon"
                      placeholder="Search..."
                      startIcon={<Search className="h-4 w-4" />}
                    />
                    <EnhancedInput
                      label="Error State"
                      placeholder="Enter email..."
                      errorText="Please enter a valid email address"
                      startIcon={<Mail className="h-4 w-4" />}
                    />
                  </VStack>
                  <VStack gap="md">
                    <EnhancedInput
                      label="Success State"
                      placeholder="All good!"
                      state="success"
                      helperText="This field is valid"
                    />
                    <EnhancedInput
                      label="Warning State"
                      placeholder="Be careful..."
                      state="warning"
                      helperText="This needs attention"
                    />
                    <PasswordInput
                      label="Password Field"
                      placeholder="Enter password..."
                      helperText="Password will be hidden"
                    />
                  </VStack>
                </Grid>
              </VStack>

              <Separator />

              {/* Input Sizes */}
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Input Sizes</h3>
                <VStack gap="md" className="max-w-md">
                  <EnhancedInput size="xs" placeholder="Extra small input" />
                  <EnhancedInput size="sm" placeholder="Small input" />
                  <EnhancedInput size="default" placeholder="Default input" />
                  <EnhancedInput size="lg" placeholder="Large input" />
                  <EnhancedInput size="xl" placeholder="Extra large input" />
                </VStack>
              </VStack>

              <Separator />

              {/* Input Variants */}
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Input Style Variants</h3>
                <VStack gap="md" className="max-w-md">
                  <EnhancedInput 
                    variant="default" 
                    placeholder="Default border style" 
                    label="Default Variant"
                  />
                  <EnhancedInput 
                    variant="ghost" 
                    placeholder="Ghost variant" 
                    label="Ghost Variant"
                  />
                  <EnhancedInput 
                    variant="underline" 
                    placeholder="Underline only" 
                    label="Underline Variant"
                  />
                </VStack>
              </VStack>
            </VStack>
          </CardContent>
        </Card>

        {/* Card System Demo */}
        <Card variant="default">
          <CardHeader>
            <CardTitle size="2xl">Card System</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols="3" gap="lg">
              <Card variant="default">
                <CardHeader>
                  <CardTitle size="lg">Default Card</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Standard card with border and shadow
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    This is the default card variant with standard styling.
                  </p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle size="lg">Elevated Card</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Enhanced shadow for prominence
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    This card has enhanced shadows for visual hierarchy.
                  </p>
                </CardContent>
              </Card>

              <Card variant="interactive">
                <CardHeader>
                  <CardTitle size="lg">Interactive Card</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Hover effects and cursor pointer
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    This card responds to hover with scale and shadow effects.
                  </p>
                </CardContent>
              </Card>

              <Card variant="success">
                <CardHeader>
                  <CardTitle size="lg">Success Card</CardTitle>
                  <p className="text-sm">
                    Green themed for positive states
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Used for success messages and positive feedback.
                  </p>
                </CardContent>
              </Card>

              <Card variant="warning">
                <CardHeader>
                  <CardTitle size="lg">Warning Card</CardTitle>
                  <p className="text-sm">
                    Yellow themed for caution
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Used for warnings and important notices.
                  </p>
                </CardContent>
              </Card>

              <Card variant="danger">
                <CardHeader>
                  <CardTitle size="lg">Danger Card</CardTitle>
                  <p className="text-sm">
                    Red themed for errors
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Used for error states and destructive actions.
                  </p>
                </CardContent>
              </Card>
            </Grid>
          </CardContent>
        </Card>

        {/* Badge System */}
        <Card variant="default">
          <CardHeader>
            <CardTitle size="2xl">Badge & Component Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <VStack gap="lg">
              <VStack gap="md">
                <h3 className="text-lg font-semibold">Badge Variants</h3>
                <HStack gap="md" wrap="wrap">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </HStack>
              </VStack>

              <Separator />

              <VStack gap="md">
                <h3 className="text-lg font-semibold">Combined Components</h3>
                <Card variant="outline" className="max-w-md">
                  <CardHeader>
                    <HStack justify="between" align="center">
                      <CardTitle size="lg">Status Card</CardTitle>
                      <Badge variant="secondary">Active</Badge>
                    </HStack>
                  </CardHeader>
                  <CardContent>
                    <VStack gap="md">
                      <p className="text-sm text-muted-foreground">
                        This demonstrates how components work together seamlessly.
                      </p>
                      <HStack gap="sm">
                        <Button size="sm" variant="outline">Cancel</Button>
                        <Button size="sm">Confirm</Button>
                      </HStack>
                    </VStack>
                  </CardContent>
                </Card>
              </VStack>
            </VStack>
          </CardContent>
        </Card>

        {/* Theme Demonstration */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle size="2xl" className="text-white">
              Theme System
            </CardTitle>
            <p className="text-white/90">
              Dynamic light/dark mode with semantic color tokens
            </p>
          </CardHeader>
          <CardContent>
            <VStack gap="md">
              <p className="text-white/80 text-sm">
                All components automatically adapt to theme changes using CSS custom properties.
                Toggle the theme using the button in the top-right corner.
              </p>
              <HStack gap="md">
                <Badge className="bg-white/20 text-white border-white/30">
                  CSS Variables
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  Auto-adaptive
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  System Preference
                </Badge>
              </HStack>
            </VStack>
          </CardContent>
        </Card>
      </VStack>
    </Container>
  );
}
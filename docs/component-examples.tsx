/**
 * Component Usage Examples
 * Demonstrates how to use the enhanced shadcn/ui components with variants
 * Part of the hive mind collective component library
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Input, SearchInput, FileInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardActions } from "@/components/ui/card";
import { Header, Sidebar, Breadcrumb, Tabs } from "@/components/ui/navigation";
import { Pagination, PaginationInfo, ItemsPerPage } from "@/components/ui/pagination";

// =============================================================================
// Button Examples
// =============================================================================

export const ButtonExamples = () => {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Enhanced Button Examples</h2>
      
      {/* Size Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Size Variants</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>

      {/* Style Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Style Variants</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="gradient">Gradient</Button>
        </div>
      </div>

      {/* Interactive States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive States</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <Button loading>Loading</Button>
          <Button loading loadingText="Processing...">Custom Loading</Button>
          <Button disabled>Disabled</Button>
          <Button leftIcon={<span>📧</span>}>With Left Icon</Button>
          <Button rightIcon={<span>→</span>}>With Right Icon</Button>
        </div>
      </div>

      {/* Special Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Special Variants</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
          <Button variant="ghost-primary">Ghost Primary</Button>
          <Button variant="destructive-outline">Destructive Outline</Button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Input Examples
// =============================================================================

export const InputExamples = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  return (
    <div className="space-y-8 p-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Enhanced Input Examples</h2>
      
      {/* Basic Inputs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Inputs</h3>
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="Enter your email"
          required
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="Enter your password"
          helperText="Password must be at least 8 characters"
        />
      </div>

      {/* Input Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Input Variants</h3>
        <Input variant="default" placeholder="Default variant" />
        <Input variant="filled" placeholder="Filled variant" />
        <Input variant="outline" placeholder="Outline variant" />
        <Input variant="ghost" placeholder="Ghost variant" />
        <Input variant="underline" placeholder="Underline variant" />
      </div>

      {/* Input States */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Input States</h3>
        <Input 
          state="error" 
          error="This field is required" 
          placeholder="Error state" 
        />
        <Input 
          state="warning" 
          helperText="This value might cause issues" 
          placeholder="Warning state" 
        />
        <Input 
          state="success" 
          helperText="Perfect!" 
          placeholder="Success state" 
        />
        <Input loading placeholder="Loading state" />
      </div>

      {/* Input with Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Input with Icons</h3>
        <Input 
          leftIcon={<span>🔍</span>}
          placeholder="Search..."
          clearable
        />
        <Input 
          rightIcon={<span>@</span>}
          placeholder="Username"
        />
      </div>

      {/* Search Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Search Input</h3>
        <SearchInput
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          suggestions={["Alice Johnson", "Bob Smith", "Charlie Brown"]}
          showSuggestions={true}
          onSearch={(query) => console.log("Searching for:", query)}
        />
      </div>

      {/* File Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">File Input</h3>
        <FileInput
          accept="image/*"
          multiple
          dragAndDrop
          onFileSelect={(files) => console.log("Selected files:", files)}
        />
      </div>
    </div>
  );
};

// =============================================================================
// Textarea Examples
// =============================================================================

export const TextareaExamples = () => {
  return (
    <div className="space-y-8 p-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Enhanced Textarea Examples</h2>
      
      {/* Basic Textarea */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Textarea</h3>
        <Textarea 
          label="Message" 
          placeholder="Enter your message..."
          helperText="Minimum 10 characters"
        />
      </div>

      {/* Textarea Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Textarea Variants</h3>
        <Textarea variant="filled" placeholder="Filled variant" />
        <Textarea variant="outline" placeholder="Outline variant" />
        <Textarea variant="ghost" placeholder="Ghost variant" />
      </div>

      {/* Textarea Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Textarea Features</h3>
        <Textarea 
          label="Auto-resize Textarea"
          autoResize
          placeholder="This textarea will grow as you type..."
          resize="none"
        />
        <Textarea 
          label="Character Counter"
          maxLength={200}
          showCount
          placeholder="Maximum 200 characters..."
        />
      </div>
    </div>
  );
};

// =============================================================================
// Select Examples
// =============================================================================

export const SelectExamples = () => {
  const options = [
    { value: "react", label: "React", icon: "⚛️" },
    { value: "vue", label: "Vue.js", icon: "🟢" },
    { value: "angular", label: "Angular", icon: "🔺" },
    { value: "svelte", label: "Svelte", icon: "🧡" },
  ];

  return (
    <div className="space-y-8 p-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Enhanced Select Examples</h2>
      
      {/* Basic Select */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Select</h3>
        <EnhancedSelect
          label="Framework"
          options={options}
          placeholder="Choose a framework..."
        />
      </div>

      {/* Multi-select */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Multi-select</h3>
        <EnhancedSelect
          label="Technologies"
          options={options}
          multiple
          clearable
          placeholder="Select multiple frameworks..."
        />
      </div>

      {/* Searchable Select */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Searchable Select</h3>
        <EnhancedSelect
          label="Searchable Framework"
          options={options}
          searchable
          clearable
          placeholder="Search and select..."
        />
      </div>
    </div>
  );
};

// =============================================================================
// Card Examples
// =============================================================================

export const CardExamples = () => {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Enhanced Card Examples</h2>
      
      {/* Card Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Card Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              Standard card with border and subtle shadow.
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
            </CardHeader>
            <CardContent>
              Enhanced shadow for prominence.
            </CardContent>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
            </CardHeader>
            <CardContent>
              Hover effects and clickable styling.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="success">
            <CardHeader>
              <CardTitle>Success</CardTitle>
            </CardHeader>
            <CardContent>
              Operation completed successfully.
            </CardContent>
          </Card>

          <Card variant="warning">
            <CardHeader>
              <CardTitle>Warning</CardTitle>
            </CardHeader>
            <CardContent>
              Please review this information.
            </CardContent>
          </Card>

          <Card variant="danger">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              Something went wrong.
            </CardContent>
          </Card>

          <Card variant="info">
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent>
              Here's some useful information.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Complex Card */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Complex Card</h3>
        <Card variant="elevated" size="lg">
          <CardHeader border="bottom">
            <CardTitle size="xl">Product Card</CardTitle>
          </CardHeader>
          <CardContent spacing="lg">
            <p>A comprehensive product description with multiple features and benefits.</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">Feature 1</span>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">Feature 2</span>
            </div>
          </CardContent>
          <CardFooter justify="between" border="top">
            <span className="text-2xl font-bold text-primary">$99</span>
            <CardActions gap="md">
              <Button variant="outline" size="sm">Add to Cart</Button>
              <Button size="sm">Buy Now</Button>
            </CardActions>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// =============================================================================
// Navigation Examples
// =============================================================================

export const NavigationExamples = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Category", href: "/products/category" },
    { label: "Current Page" },
  ];

  const tabItems = [
    { value: "overview", label: "Overview", icon: "📊" },
    { value: "analytics", label: "Analytics", icon: "📈", badge: "new" },
    { value: "settings", label: "Settings", icon: "⚙️" },
    { value: "help", label: "Help", icon: "❓" },
  ];

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Navigation Examples</h2>
      
      {/* Header */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Header</h3>
        <Header
          variant="filled"
          size="lg"
          sticky
          logo={<span className="text-xl font-bold">🚀 Brand</span>}
          navigation={
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary">Home</a>
              <a href="#" className="hover:text-primary">Products</a>
              <a href="#" className="hover:text-primary">About</a>
            </div>
          }
          actions={
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm">Sign Up</Button>
            </div>
          }
        />
      </div>

      {/* Breadcrumb */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Breadcrumb</h3>
        <Breadcrumb items={breadcrumbItems} maxItems={4} />
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tabs</h3>
        <Tabs 
          items={tabItems} 
          variant="pills"
          onValueChange={(value) => console.log("Tab changed:", value)}
        />
      </div>

      {/* Sidebar Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sidebar</h3>
        <div className="flex h-64 border rounded-lg overflow-hidden">
          <Sidebar
            variant="default"
            collapsible
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            header={<span className="font-semibold">Navigation</span>}
            footer={<span className="text-sm text-muted-foreground">v1.0.0</span>}
          >
            <div className="p-4 space-y-2">
              <div className="p-2 hover:bg-accent rounded">Dashboard</div>
              <div className="p-2 hover:bg-accent rounded">Users</div>
              <div className="p-2 hover:bg-accent rounded">Settings</div>
            </div>
          </Sidebar>
          <div className="flex-1 p-4 bg-muted/30">
            <p>Main content area</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Pagination Examples
// =============================================================================

export const PaginationExamples = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const totalItems = 247;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Pagination Examples</h2>
      
      {/* Basic Pagination */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Pagination</h3>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Pagination with Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pagination with Info</h3>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <PaginationInfo
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            size="sm"
          />
        </div>
      </div>

      {/* Items Per Page Selector */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Items Per Page</h3>
        <div className="flex justify-between items-center">
          <ItemsPerPage
            value={itemsPerPage}
            onValueChange={setItemsPerPage}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            onPageChange={setCurrentPage}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Complete Examples Showcase
// =============================================================================

export const ComponentShowcase = () => {
  return (
    <div className="space-y-12">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Enhanced shadcn/ui Components</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive component variants with enhanced functionality
        </p>
      </div>
      
      <ButtonExamples />
      <InputExamples />
      <TextareaExamples />
      <SelectExamples />
      <CardExamples />
      <NavigationExamples />
      <PaginationExamples />
    </div>
  );
};

export default ComponentShowcase;
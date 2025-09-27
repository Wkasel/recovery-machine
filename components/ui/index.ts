/**
 * UI Components Barrel Export
 * 
 * Centralized exports for all shadcn/ui based components
 * with enhanced variants and functionality.
 */

// === FORM COMPONENTS ===
export { Button, buttonVariants, type ButtonProps } from './button'
export { Input, type InputProps } from './input'
export { Textarea, type TextareaProps } from './textarea'
export { Label, type LabelProps } from './label'
export { Checkbox, type CheckboxProps } from './checkbox'
export { RadioGroup, RadioGroupItem, type RadioGroupProps } from './radio-group'
export { Switch, type SwitchProps } from './switch'
export { Slider, type SliderProps } from './slider'
export { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectGroup, 
  SelectLabel, 
  SelectSeparator,
  type SelectProps 
} from './select'
export { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  useFormField,
  type FormFieldProps,
  type FormItemProps,
  type FormLabelProps,
  type FormControlProps,
  type FormDescriptionProps,
  type FormMessageProps
} from './form'

// === LAYOUT COMPONENTS ===
export { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardImage, 
  CardActions,
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardFooterVariants,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps
} from './card'
export { Separator, type SeparatorProps } from './separator'
export { AspectRatio, type AspectRatioProps } from './aspect-ratio'
export { ScrollArea, ScrollBar, type ScrollAreaProps } from './scroll-area'
export { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable'

// === NAVIGATION COMPONENTS ===
export { Tabs, TabsContent, TabsList, TabsTrigger, type TabsProps } from './tabs'
export { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from './navigation-menu'
export { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from './breadcrumb'
export { 
  Pagination, 
  PaginationInfo, 
  ItemsPerPage,
  paginationVariants,
  paginationContentVariants,
  paginationItemVariants,
  paginationLinkVariants,
  type PaginationProps,
  type PaginationInfoProps,
  type ItemsPerPageProps
} from './pagination'

// === FEEDBACK COMPONENTS ===
export { Badge, badgeVariants, type BadgeProps } from './badge'
export { Alert, AlertDescription, AlertTitle, type AlertProps } from './alert'
export { Progress, type ProgressProps } from './progress'
export { Skeleton, type SkeletonProps } from './skeleton'
export { Toaster } from './sonner'

// === OVERLAY COMPONENTS ===
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  type DialogProps
} from './dialog'
export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
  type SheetProps
} from './sheet'
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogProps
} from './alert-dialog'
export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  type DrawerProps
} from './drawer'

// === DROPDOWN COMPONENTS ===
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
  type DropdownMenuProps
} from './dropdown-menu'
export { Popover, PopoverContent, PopoverTrigger, type PopoverProps } from './popover'
export { HoverCard, HoverCardContent, HoverCardTrigger, type HoverCardProps } from './hover-card'
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, type TooltipProps } from './tooltip'
export { 
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  type CommandProps
} from './command'

// === MENU COMPONENTS ===
export { 
  Menubar, 
  MenubarCheckboxItem, 
  MenubarContent, 
  MenubarItem, 
  MenubarLabel, 
  MenubarMenu, 
  MenubarRadioGroup, 
  MenubarRadioItem, 
  MenubarSeparator, 
  MenubarShortcut, 
  MenubarSub, 
  MenubarSubContent, 
  MenubarSubTrigger, 
  MenubarTrigger 
} from './menubar'
export { 
  ContextMenu, 
  ContextMenuCheckboxItem, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuLabel, 
  ContextMenuRadioGroup, 
  ContextMenuRadioItem, 
  ContextMenuSeparator, 
  ContextMenuShortcut, 
  ContextMenuSub, 
  ContextMenuSubContent, 
  ContextMenuSubTrigger, 
  ContextMenuTrigger 
} from './context-menu'

// === DATA DISPLAY COMPONENTS ===
export { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  type TableProps
} from './table'
export { Avatar, AvatarImage, AvatarFallback, type AvatarProps } from './avatar'
export { 
  type ChartConfig,
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartStyle,
  ChartTooltip, 
  ChartTooltipContent
} from './chart'
export { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious, 
  type CarouselApi,
  type CarouselProps 
} from './carousel'

// === INTERACTION COMPONENTS ===
export { Toggle, toggleVariants, type ToggleProps } from './toggle'
export { ToggleGroup, ToggleGroupItem, type ToggleGroupProps } from './toggle-group'
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger, type AccordionProps } from './accordion'
export { Collapsible, CollapsibleContent, CollapsibleTrigger, type CollapsibleProps } from './collapsible'

// === SIDEBAR COMPONENTS ===
export { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupAction, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarInput, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuAction, 
  SidebarMenuBadge, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSkeleton, 
  SidebarMenuSub, 
  SidebarMenuSubButton, 
  SidebarMenuSubItem, 
  SidebarProvider, 
  SidebarRail, 
  SidebarSeparator, 
  SidebarTrigger, 
  useSidebar,
  type SidebarProps 
} from './sidebar'

// === INPUT COMPONENTS ===
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, type InputOTPProps } from './input-otp'
// export { Calendar, type CalendarProps } from './calendar'  // TODO: Add calendar component

// === THEME COMPONENTS ===
export { ThemeToggle } from './theme-toggle'
// Fixed barrel exports
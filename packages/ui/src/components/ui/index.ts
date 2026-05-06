// @toreview
/**
 * @fileoverview Barrel export for all premium UI components.
 * @module packages/core/components/ui/index
 * @layer core
 */
// SF Premium UI Components
// Saasflare-owned components with Framer Motion, intent system, and reduced-motion support.
// Standalone customized components, partly animated using Framer Motion.

// Animation config + reduced motion
export {
  spring,
  springBouncy,
  springGentle,
  springStiff,
  noMotion,
  fadeIn,
  scaleIn,
  slideUp,
  slideDown,
  useReducedMotion,
} from "./motion-config"

// Tier A: Framer Motion Enhanced (with intent system)
export { Button, buttonVariants, type ButtonProps, type Intent } from "./button"
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./card"
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
export { Input } from "./input"
export { Textarea } from "./textarea"
export { Checkbox } from "./checkbox"
export { Switch } from "./switch"
export { Progress } from "./progress"
export { Badge, badgeVariants, type BadgeProps } from "./badge"
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover"
export { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select"
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"
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
} from "./drawer"
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"
export { Slider } from "./slider"

// Tier B: CSS Enhanced (with intent system)
export { Alert, AlertTitle, AlertDescription, type AlertProps } from "./alert"
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "./avatar"
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "./context-menu"
export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "./menubar"
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "./navigation-menu"
export { Skeleton } from "./skeleton"
export { Toggle, toggleVariants } from "./toggle"
export { ToggleGroup, ToggleGroupItem } from "./toggle-group"
// Carousel moved to subpath: import from "@saasflare/ui/carousel"
export { Calendar, CalendarDayButton } from "./calendar"
export { RadioGroup, RadioGroupItem } from "./radio-group"
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible"
export { Spinner } from "./spinner"
export { ScrollArea, ScrollBar } from "./scroll-area"
export { Toaster } from "./sonner"

// Tier C: Re-exports
export { AspectRatio } from "./aspect-ratio"
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./breadcrumb"
export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
} from "./button-group"
// Chart moved to subpath: import from "@saasflare/ui/chart"
export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxEmpty,
  ComboboxSeparator,
} from "./combobox"
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
} from "./command"
export { DirectionProvider, useDirection } from "./direction"
export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "./empty"
export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "./field"
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "./form"
export { Icons } from "./icons"
export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "./input-group"
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./input-otp"
export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
} from "./item"
export { Kbd, KbdGroup } from "./kbd"
export { Label } from "./label"
export {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select"
export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./pagination"
export {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable"
export { Separator } from "./separator"
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table"
export { AnimatedTooltip, type TooltipItem } from "./animated/tooltip"
export { TypewriterText } from "./typewriter-text"
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
} from "./sidebar"

// Tier D: Composed SaaS Components
export { PageHeader, type PageHeaderProps } from "./page-header"
export { SectionCard, type SectionCardProps } from "./section-card"
export { MetricCard, type MetricCardProps, type MetricTrend } from "./metric-card"
export { EmptyState, type EmptyStateProps } from "./empty-state"
export { SearchField, type SearchFieldProps } from "./search-field"
export { SettingsSection, type SettingsSectionProps } from "./settings-section"
export { PricingCard, type PricingCardProps } from "./pricing-card"
export {
  DataToolbar,
  DataToolbarSearch,
  DataToolbarFilters,
  DataToolbarActions,
} from "./data-toolbar"

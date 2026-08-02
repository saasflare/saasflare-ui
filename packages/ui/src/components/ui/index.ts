// @toreview
/**
 * @fileoverview Barrel export for all premium UI components.
 * @module packages/ui/components/ui/index
 * @layer core
 */
// SF Premium UI Components
// Saasflare-owned components with Motion, intent system, and reduced-motion support.
// Standalone customized components, partly animated using Motion.

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
  useSaasflareMotion,
  type SaasflareMotion,
} from "./motion-config"

// Tier A: Motion Enhanced (with intent system)
export { Button, buttonVariants, type ButtonProps, type Intent, type SpinnerPlacement } from "./button"
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
export {
  ProgressCircle,
  type ProgressCircleProps,
  type ProgressCircleSize,
} from "./progress-circle"
export { Badge, badgeVariants, type BadgeProps } from "./badge"
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow, type TooltipArrowProps } from "./tooltip"
export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger, PopoverArrow, type PopoverArrowProps } from "./popover"
export { HoverCard, HoverCardContent, HoverCardTrigger, HoverCardArrow, type HoverCardArrowProps } from "./hover-card"
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
// Drawer moved to subpath: import from "@saasflare/ui/drawer"
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
// Calendar moved to subpath: import from "@saasflare/ui/calendar"
export { RadioGroup, RadioGroupItem } from "./radio-group"
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible"
export { Spinner } from "./spinner"
export { ScrollArea, ScrollBar } from "./scroll-area"
export { Toaster, toast, type SaasflareToasterProps } from "./sonner"

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
// Command moved to subpath: import from "@saasflare/ui/command"
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
  IconBase,
  type IconWeight,
  type PhosphorIconProps,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  CheckIcon,
  CheckCircleIcon,
  CircleIcon,
  CircleNotchIcon,
  DotsSixVerticalIcon,
  DotsThreeIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  MonitorIcon,
  MoonIcon,
  PauseIcon,
  PlayIcon,
  QuotesIcon,
  SidebarSimpleIcon,
  SunIcon,
  WarningIcon,
  XIcon,
  XCircleIcon,
  // Brand marks. Present in the package since 3.0 but never re-exported —
  // any consumer building its own login form had to reimplement them.
  AppleLogoIcon,
  DiscordLogoIcon,
  DribbbleLogoIcon,
  FacebookLogoIcon,
  GithubLogoIcon,
  GitlabLogoIcon,
  GoogleLogoIcon,
  LinkedinLogoIcon,
  MediumLogoIcon,
  MicrosoftOutlookLogoIcon,
  PaypalLogoIcon,
  RedditLogoIcon,
  SlackLogoIcon,
  StripeLogoIcon,
  TiktokLogoIcon,
  XLogoIcon,
} from "./phosphor"
export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from "./input-group"
// InputOTP moved to subpath: import from "@saasflare/ui/input-otp"
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
// Resizable moved to subpath: import from "@saasflare/ui/resizable"
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
export { AnimatedBeam, type AnimatedBeamProps } from "./animated/beam"
export { AnimatedCounter, type AnimatedCounterProps } from "./animated/counter"
export { AnimatedCursor, type AnimatedCursorProps } from "./animated/cursor"
export { AnimatedShinyText, type AnimatedShinyTextProps } from "./animated/shiny-text"
export {
  AnimatedTestimonials,
  type AnimatedTestimonialsProps,
  type Testimonial,
} from "./animated/testimonials"
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
export { BarList, type BarListItem, type BarListProps } from "./bar-list"
export { SparkChart, type SparkChartProps, type SparkChartVariant } from "./spark-chart"
export { Tracker, type TrackerBlock, type TrackerProps } from "./tracker"
export {
  Dropzone,
  type DropzoneProps,
  type DropzoneRejection,
  type DropzoneRejectionReason,
} from "./dropzone"
export {
  DateRangePicker,
  type DateRange,
  type DateRangePickerProps,
} from "./date-range-picker"
export { DatePicker, type DatePickerProps } from "./date-picker"
export { Callout, type CalloutIntent, type CalloutProps } from "./callout"
export { TagInput, type TagInputProps } from "./tag-input"
export { NumberInput, type NumberInputProps } from "./number-input"
export { Rating, type RatingProps, type RatingSize } from "./rating"
export {
  CategoryBar,
  type CategoryBarProps,
  type CategoryBarSegment,
} from "./category-bar"
export { TreeView, type TreeNode, type TreeViewProps } from "./tree-view"
export { CodeBlock, type CodeBlockProps } from "./code-block"
export {
  NotificationCenter,
  type NotificationCenterProps,
  type NotificationItem,
} from "./notification-center"
export { EmptyState, type EmptyStateProps } from "./empty-state"
export { SearchField, type SearchFieldProps } from "./search-field"
export { SettingsSection, type SettingsSectionProps } from "./settings-section"
export { PricingCard, type PricingCardProps, type PricingCardFeature } from "./pricing-card"
export {
  DataToolbar,
  DataToolbarSearch,
  DataToolbarFilters,
  DataToolbarActions,
} from "./data-toolbar"
export { AuroraBackground, type AuroraBackgroundProps } from "./aurora-background"

/* ── Catalog-expansion components promoted to public API (2026-05-29) ── */
export { AudioPlayer, type AudioPlayerProps } from "./audio-player"
export { BentoGrid, BentoGridItem, type BentoGridProps, type BentoGridItemProps } from "./bento-grid"
export { BlurFade, type BlurFadeProps } from "./blur-fade"
export { BorderBeam, type BorderBeamProps } from "./border-beam"
export { Compare, type CompareProps } from "./compare"
export { Confetti, type ConfettiProps } from "./confetti"
export { Countdown, type CountdownProps } from "./countdown"
export { SafariMock, IPhoneMock, type SafariMockProps, type IPhoneMockProps } from "./device-mock"
export { Dock, DockItem, type DockProps, type DockItemProps } from "./dock"
export { FeatureCard, type FeatureCardProps } from "./feature-card"
export { FlipWords, type FlipWordsProps } from "./flip-words"
export { GalleryLightbox, type GalleryLightboxProps } from "./gallery-lightbox"
export { GlowingEffect, type GlowingEffectProps } from "./glowing-effect"
export { GradientText, type GradientTextProps } from "./gradient-text"
export { HeroVideoDialog, type HeroVideoDialogProps } from "./hero-video-dialog"
export { Hotspot, HotspotMarker, type HotspotProps, type HotspotMarkerProps } from "./hotspot"
export { ImageSwapHover, type ImageSwapHoverProps } from "./image-swap-hover"
export { Marquee, type MarqueeProps } from "./marquee"
export { MouseGradientBlob, type MouseGradientBlobProps } from "./mouse-gradient-blob"
export { MovingBorder, type MovingBorderProps } from "./moving-border"
export { PageTransition, type PageTransitionProps } from "./page-transition"
export { ParallaxSection, type ParallaxSectionProps } from "./parallax-section"
export { ParticlesBackground, type ParticlesBackgroundProps } from "./particles-background"
export { RetroGrid, type RetroGridProps } from "./retro-grid"
export { RevealOnScroll, type RevealOnScrollProps } from "./reveal-on-scroll"
export { ShimmerButton, type ShimmerButtonProps } from "./shimmer-button"
export { SocialButton, type SocialButtonProps, type SocialButtonProvider } from "./social-button"
export { SpotlightCard, type SpotlightCardProps } from "./spotlight-card"
export { StatCard, type StatCardProps } from "./stat-card"
export { Steps, Step, type StepsProps, type StepProps } from "./steps"
export { StickyScrollReveal, type StickyScrollItem, type StickyScrollRevealProps } from "./sticky-scroll-reveal"
export { TeamCard, type SocialLink, type TeamCardProps } from "./team-card"
export { TestimonialCard, type TestimonialCardProps } from "./testimonial-card"
export { TextGenerateEffect, type TextGenerateEffectProps } from "./text-generate-effect"
export { Timeline, TimelineItem, type TimelineProps, type TimelineItemProps } from "./timeline"
export { TracingBeam, type TracingBeamProps } from "./tracing-beam"

/* ── Competitive feature components (2026-06-01) ── */
export {
  DataPagination,
  type DataPaginationProps,
  type DataPaginationLayout,
  type DataPaginationLabels,
} from "./data-pagination"
export {
  MultiSelect,
  type MultiSelectProps,
  type MultiSelectOption,
} from "./multi-select"
export {
  DataTable,
  type DataTableProps,
  type DataTableColumn,
  type DataTableSort,
  type DataTableAlign,
  type DataTableDensity,
} from "./data-table"
export {
  Stepper,
  StepperPanel,
  StepperNav,
  StepperContent,
  type StepperProps,
  type StepperItem,
  type StepperPanelProps,
  type StepperNavProps,
  type StepperContentProps,
} from "./stepper"

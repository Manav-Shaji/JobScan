// Strict compatibility layer for extension UI.
// Only components that do NOT depend on next/link or next/navigation are exported here.

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Separator, Skeleton } from "@/frontend/ui/layout";
export { Input, Label, Switch, Textarea, Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/frontend/ui/forms";
export { Alert } from "@/frontend/ui/feedback/Alert";
// Exporting Button and Badge if they exist elsewhere, assuming standard Radix/Tailwind ones.
// Assuming button and badge are defined in some standard place, we will alias them directly.
// (Will update once we find their exact locations, for now relying on existing shared UI structure)

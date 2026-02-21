"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export function SidebarThemeButton() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground">
        <span className="h-4 w-4" /> {/* Placeholder for icon */}
        <span>{t('sidebar.loading')}</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"
  const currentIcon = isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
  const label = isDark ? t('theme.dark') : t('theme.light')

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button 
      variant="ghost" 
      onClick={toggleTheme} 
      className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {currentIcon}
      <span>{label}</span>
    </Button>
  )
}

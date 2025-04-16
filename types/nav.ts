export interface NavItem {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  auth?: boolean;
}

export interface FooterNavItem {
  title: string;
  href: string | ((meta: any) => string);
  description?: string;
  disabled?: boolean;
  external?: boolean;
  auth?: boolean;
}

export interface NavigationConfig {
  mainNav: NavItem[];
  userNav: NavItem[];
  footerNav: {
    product: NavItem[];
    company: NavItem[];
    legal: NavItem[];
    social: FooterNavItem[];
  };
}

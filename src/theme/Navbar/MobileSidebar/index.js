import React, {useEffect} from 'react';
import {
  useLockBodyScroll,
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';

export default function NavbarMobileSidebar() {
  const mobileSidebar = useNavbarMobileSidebar();
  const {hide: hideSecondaryMenu, shown: secondaryMenuShown} =
    useNavbarSecondaryMenu();

  useLockBodyScroll(mobileSidebar.shown);

  useEffect(() => {
    if (mobileSidebar.shown && secondaryMenuShown) {
      hideSecondaryMenu();
    }
  }, [hideSecondaryMenu, mobileSidebar.shown, secondaryMenuShown]);

  if (!mobileSidebar.shouldRender) {
    return null;
  }

  return (
    <NavbarMobileSidebarLayout
      header={<NavbarMobileSidebarHeader />}
      primaryMenu={<NavbarMobileSidebarPrimaryMenu />}
      secondaryMenu={<NavbarMobileSidebarSecondaryMenu />}
    />
  );
}

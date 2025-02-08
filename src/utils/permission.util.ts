import { isMenu, isMenuGroup, isPermission } from '@/modules/system/menu/menu.dto'
import { MenuEntity } from '@/modules/system/menu/menu.entity'

export function generatorMenu(menu: MenuEntity[]) {
  return filterMenuToTable(menu, null)
}

function filterMenuToTable(menus: MenuEntity[], parentMenu: any) {
  const res = []

  menus.forEach((menu) => {
    let realMenu
    if (!parentMenu && !menu.parentId && isMenuGroup(menu)) {
      const childMenu = filterMenuToTable(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (!parentMenu && !menu.parentId && isMenu(menu)) {
      const childMenu = filterMenuToTable(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (parentMenu && parentMenu.id === menu.parentId && isMenuGroup(menu)) {
      const childMenu = filterMenuToTable(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (parentMenu && parentMenu.id === menu.parentId && isMenu(menu)) {
      const childMenu = filterMenuToTable(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (parentMenu && parentMenu.id === menu.parentId && isPermission(menu)) {
      realMenu = { ...menu }
    }
    if (realMenu) {
      realMenu.pid = menu.id
      res.push(realMenu)
    }
  })
  return res
}

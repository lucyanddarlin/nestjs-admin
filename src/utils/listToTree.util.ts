export function deleteEmptyChildren(arr: any) {
  arr?.forEach((node) => {
    if (node.children?.length === 0) {
      delete node.children
    } else {
      deleteEmptyChildren(node.childMenu)
    }
  })
}

export const generateTextNodeMaker = (templateElement: HTMLElement) => {
  const markerCache = new WeakSet<Node>()
  const isMarked = (node: Node): node is HTMLElement => node && markerCache.has(node)
  return {
    isMarked,
    mark(node: Node) {
      if (isMarked(node)) return node as HTMLElement
      const marked = templateElement.cloneNode(false) as HTMLElement
      const clonedText = node.cloneNode(true)
      marked.appendChild(clonedText)
      markerCache.add(marked)
      if (node.parentNode) {
        node.parentNode.replaceChild(marked, node)
      }
      return marked
    },
    unmark(marked: Node) {
      if (!isMarked(marked)) return marked
      const markedElement = marked as HTMLElement
      markerCache.delete(marked)
      let unmarkedNode: Node
      if (!marked.hasChildNodes()) {
        unmarkedNode = marked
      } else if (marked.childNodes.length == 1) unmarkedNode = marked.firstChild!
      else {
        const fragment = document.createDocumentFragment()
        marked.childNodes.forEach(child => fragment.appendChild(child))
        unmarkedNode = fragment
      }
      if (markedElement.parentNode) {
        markedElement.parentNode.replaceChild(unmarkedNode, markedElement)
      }
      return unmarkedNode
    },
  }
}

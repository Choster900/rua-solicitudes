import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

type UseDropdownMenuOptions = {
  rootRef: Ref<HTMLElement | null>
  outsideClickEvent?: 'click' | 'mousedown'
  onClose?: () => void
}

export function useDropdownMenu(options: UseDropdownMenuOptions) {
  const { rootRef, outsideClickEvent = 'click', onClose } = options
  const isOpen = ref(false)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    if (!isOpen.value) {
      return
    }

    isOpen.value = false
    onClose?.()
  }

  const toggle = () => {
    if (isOpen.value) {
      close()
      return
    }

    open()
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (!isOpen.value) {
      return
    }

    const target = event.target as Node | null

    if (!target || !rootRef.value) {
      return
    }

    if (!rootRef.value.contains(target)) {
      close()
    }
  }

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close()
    }
  }

  onMounted(() => {
    document.addEventListener(outsideClickEvent, handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
  })

  onBeforeUnmount(() => {
    document.removeEventListener(outsideClickEvent, handleOutsideClick)
    document.removeEventListener('keydown', handleEscape)
  })

  return { isOpen, open, close, toggle }
}

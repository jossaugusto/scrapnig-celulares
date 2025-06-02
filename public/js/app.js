document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('buscador')
  input.addEventListener('input', () => {
    const filtro = input.value.toLowerCase()
    const tarjetas = document.querySelectorAll('.product-card')
    const tiendas = document.querySelectorAll('.store')
    const marcas = document.querySelectorAll('.brand')

    // Resetear visibilidad y estilos
    tiendas.forEach(tienda => {
      tienda.style.display = 'block'
      tienda.style.backgroundColor = ''
      tienda.style.padding = ''
      tienda.style.borderRadius = ''
      tienda.style.marginBottom = ''
      tienda.style.boxShadow = ''
      tienda.style.border = ''
    })
    marcas.forEach(marca => {
      marca.style.display = 'block'
    })

    // Filtrar tarjetas
    tarjetas.forEach(card => {
      const texto = card.textContent.toLowerCase()
      if (texto.includes(filtro)) {
        card.style.display = 'flex'
      } else {
        card.style.display = 'none'
      }
    })

    // Si hay filtro, manejar visibilidad de tiendas y marcas
    if (filtro.trim() !== '') {
      tiendas.forEach(tienda => {
        const tarjetasVisibles = tienda.querySelectorAll('.product-card[style*="flex"]')
        const marcasEnTienda = tienda.querySelectorAll('.brand')

        if (tarjetasVisibles.length === 0) {
          // 1. Ocultar tienda si no tiene productos visibles
          tienda.style.display = 'none'
        } else {
          // 2. Mostrar solo marcas que coincidan con productos visibles
          marcasEnTienda.forEach(marca => {
            const productosEnMarca = marca.nextElementSibling.querySelectorAll('.product-card[style*="flex"]')
            if (productosEnMarca.length === 0) {
              marca.style.display = 'none'
              marca.nextElementSibling.style.display = 'none' // Ocultar contenedor de productos
            } else {
              marca.style.display = 'block'
              marca.nextElementSibling.style.display = 'flex' // Mantener flex para el layout horizontal
            }
          })
        }
      })
    } else {
      // Mostrar todo si no hay filtro
      tarjetas.forEach(card => {
        card.style.display = 'flex'
      })
      marcas.forEach(marca => {
        marca.nextElementSibling.style.display = 'flex' // Mantener flex para el layout horizontal
      })
    }
  })
})

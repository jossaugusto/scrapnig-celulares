import puppeteer from 'puppeteer'
import { writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { URL } from '../config/url.js'

// Obtener __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Ruta donde guardar el JSON
const outputPath = marca => path.join(__dirname, `../data/claro/claro-${marca}.json`)

export const scrapeClaro = async ({ marca }) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await page.goto(URL.CLARO, { waitUntil: 'networkidle2' })

    // -----------------

    console.log('Clickeando en Marca')

    await page.click('.vtex-search-result-3-x-filterPopupTitle')

    console.log('Esperando por 2 segundos')

    await new Promise(resolve => setTimeout(resolve, 2000)) // Esperar a que cargue todo el contenido

    console.log('Clickeando en la marca:', marca)

    await page.click(`label[for="${marca}"]`)

    console.log('Se logro clickear la marca')

    // -----------------

    await new Promise(resolve => setTimeout(resolve, 2000)) // Esperar a que cargue todo el contenido

    let data = []
    let mostrarMas = true

    while (mostrarMas) {
      const result = await page.evaluate(() => {
        const items = []
        let agotadoDetectado = false

        const productos = document.querySelectorAll('.vtex-search-result-3-x-galleryItem')

        for (const producto of productos) {
          const agotado = producto
            .querySelector('.claroperupoc-claro-product-card-detail-app-0-x-label_texto_agotado')
            ?.innerText.trim()

          if (agotado) {
            agotadoDetectado = true
            break
          }

          const marca = producto
            .querySelector('.claroperupoc-claro-product-card-detail-app-0-x-product_brand_content')
            ?.innerText.trim()
          const modelo = producto
            .querySelector('.claroperupoc-claro-product-card-detail-app-0-x-product_name_content')
            ?.innerText.trim()
          const capacidad = producto
            .querySelector('.claroperupoc-claro-product-card-detail-app-0-x-capacidad_product__item')
            ?.innerText.trim()
          const precio = producto
            .querySelector('.claroperupoc-claro-product-card-detail-app-0-x-product_price_online')
            ?.innerText.trim()
          const img = producto.querySelector(
            '.claroperupoc-claro-product-card-detail-app-0-x-product_image_content'
          )?.src
          const link = producto.querySelector('.vtex-product-summary-2-x-clearLink')?.href

          if (marca && modelo && capacidad && precio && img && link) {
            items.push({ marca, modelo, capacidad, precio, img, link })
          }
        }

        return { items, agotadoDetectado }
      })

      data = result.items
      console.log(`🟢 Productos obtenidos: ${data.length}`)

      if (result.agotadoDetectado) {
        console.log('⚠️ Producto agotado detectado. Deteniendo scraping.')
        break
      }

      // Verificar si hay botón "Mostrar más"
      const button = await page.$(
        '.vtex-flex-layout-0-x-flexRow.vtex-flex-layout-0-x-flexRow--container--search-fetch-more button.vtex-button'
      )

      if (button) {
        const text = await page.evaluate(el => el.innerText.trim(), button)
        if (text === 'Mostrar más') {
          console.log('🟡 Click en "Mostrar más"...')
          await button.click()
          await new Promise(resolve => setTimeout(resolve, 2000))
        } else {
          mostrarMas = false
        }
      } else {
        mostrarMas = false
      }
    }

    // Guardar en JSON solo si hay productos
    if (data.length > 0) {
      await writeFile(outputPath(marca), JSON.stringify(data, null, 2), 'utf-8')
      console.log(`✅ Claro: ${data.length} productos guardados.`)
    } else {
      console.log('⚠️ No se guardaron productos porque se encontró uno agotado al inicio.')
    }
  } catch (error) {
    console.error('❌ Error al hacer scraping de Claro:', error)
  } finally {
    await browser.close()
  }
}

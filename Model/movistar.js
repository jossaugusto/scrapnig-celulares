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
const outputPath = marca => {
  return path.join(__dirname, `../data/movistar/movistar-${marca}.json`)
}

export const scrapeMovistar = async ({ marca }) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    console.log('Iniciando scraping en Movistar')

    await page.goto(URL.MOVISTAR, { waitUntil: 'networkidle2' })

    // -----------------

    await new Promise(resolve => setTimeout(resolve, 10000)) // Esperar a que cargue todo el contenido

    console.log('Clickeando en Marca')

    await page.click(`img[alt="${marca}"]`)

    console.log('Se logro clickear la marca')

    // -----------------

    console.log('Esperando por 5 segundos')
    await new Promise(resolve => setTimeout(resolve, 5000)) // Esperar a que cargue todo el contenido

    let data = []
    let pagina = 1

    while (true) {
      console.log(`🟡 Scrapeando página ${pagina}...`)

      const result = await page.evaluate(() => {
        const items = []
        let agotadoDetectado = false

        const productos = document.querySelectorAll('li[producto-data="product"]')

        for (const producto of productos) {
          const agotado = producto.querySelector('.outofstock-text')?.innerText.trim()
          if (agotado) {
            agotadoDetectado = true
            break
          }

          const marca = producto.querySelector('.marca')?.innerText.trim()
          const modelo = producto.querySelector('.name-product')?.innerText.trim()
          const precio = producto.querySelector('.special_price')?.innerText.trim()
          const img = producto.querySelector('img[itemprop="image"]')?.src
          const link = producto.querySelector('a[itemprop="url"]')?.href

          if (marca && modelo && precio && img && link) {
            items.push({ marca, modelo, precio, img, link })
          }
        }

        return { items, agotadoDetectado }
      })

      data.push(...result.items)

      console.log(`📦 Productos encontrados en página ${pagina}: ${result.items.length}`)
      console.log(`📊 Total productos acumulados: ${data.length}`)

      if (result.agotadoDetectado) {
        console.log('⚠️ Producto agotado detectado. Terminando scraping.')
        break
      }

      // Verificar si existe la siguiente página (número + 1)
      const links = await page.$$('li[ng-repeat="page in pages"]')

      if (links.length > pagina) {
        console.log(`➡️ Clickeando en página #${pagina + 1}`)
        await links[pagina].click()
        pagina++
        await new Promise(resolve => setTimeout(resolve, 2000)) // Esperamos a que cargue la nueva página
      } else {
        console.log('🔴 No hay más páginas. Terminando scraping.')
        break
      }
    }

    // Guardar en JSON
    if (data.length > 0) {
      await writeFile(outputPath(marca), JSON.stringify(data, null, 2), 'utf-8')
      console.log(`✅ Entel: ${data.length} productos guardados.`)
    }
  } catch (error) {
    console.error('❌ Error al hacer scraping de Entel:', error)
  } finally {
    await browser.close()
  }
}

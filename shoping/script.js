const CART_KEY = "cartItems"

async function fetchProducts() {
  try {
    const response = await fetch("./mock.json")
    if (!response.ok) throw new Error("Error fetching products")
    return await response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

function getCartItems() {
  const list = localStorage.getItem(CART_KEY)
  return list ? JSON.parse(list) : []
}

function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

function addToCart(productId, products) {
  const cart = getCartItems()
  const product = products.find((product) => product.id === productId)
  if (!product) return

  const index = cart.findIndex((item) => item.id === productId)
  if (index > -1) {
    cart[index].qty += 1
  } else {
    cart.push({
      id: product.id,
      productName: product.productName,
      productPrice: product.productPrice,
      productImgFileName: product.productImgFileName,
      qty: 1,
    })
  }

  saveCartItems(cart)
  updateCartBadge()
  alert(`${product.productName}이(가) 장바구니에 담겼습니다.`)
}

function clearCart() {
  localStorage.removeItem(CART_KEY)
  updateCartBadge()
  alert("장바구니가 비워졌습니다.")
}

function updateCartBadge() {
  const cart = getCartItems()
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartLink = document.querySelector('a[href="./cart.html"]')
  if (cartLink) {
    cartLink.textContent = `Cart (${totalQty})`
  }
}

async function renderProductList() {
  const productList = document.querySelector("#product-list")
  if (!productList) return

  const products = await fetchProducts()
  productList.innerHTML = ""

  products.forEach((product) => {
    const li = document.createElement("li")

    li.innerHTML = `
      <h3>${product.productName}</h3>
      <img src="./imgs/${product.productImgFileName}" 
      alt=${product.productName} />
      <span>${product.productPrice.toLocaleString()}</span>
      <button class="addCartBtn" data-id="${product.id}">add cart</button>
    `

    productList.appendChild(li)
  })

  productList.addEventListener("click", (event) => {
    const btn = event.target.closest("button.addCartBtn")
    if (!btn) return
    const productId = Number(btn.dataset.id)
    addToCart(productId, products)
  })
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderProductList()

  const clearCartButton = document.querySelector(".clearCart")
  if (clearCartButton) {
    clearCartButton.addEventListener("click", clearCart)
  }

  updateCartBadge()
})

const product = [
  {
    id: 0,
    image: 'photo-1432149877166-f75d49000351.jpg',
    title: 'Pattern Dress',
    price: 120,
  },
  {
    id: 1,
    image: 'photo-1515886657613-9f3515b0c78f.jpg',
    title: 'Yellow Tracksuit',
    price: 60,
  },
  {
    id: 2,
    image: 'photo-1529139574466-a303027c1d8b.jpg',
    title: 'Red Tee & Jacket',
    price: 230,
  },
  {
    id: 3,
    image: 'photo-1588117260148-b47818741c74.jpg',
    title: 'Streetwear Fit',
    price: 100,
  },
  {
    id: 4,
    image: 'photo-1603344797033-f0f4f587ab60.jpg',
    title: 'Beach Elegance',
    price: 90,
  },
  {
    id: 5,
    image: 'photo-1608748010899-18f300247112.jpg',
    title: 'Layered Neutrals',
    price: 40,
  }
];
const cart = [];
const maxBundle = 3;

function renderProducts() {
  document.getElementById('root').innerHTML = product.map((item, index) => {
    return `
      <div class='box'>
        <div class='img-box'>
          <img class='images' src="${item.image}" />
        </div>
        <div class='bottom'>
          <p>${item.title}</p>
          <h2>$ ${item.price}.00</h2>
          <button id="btn-${index}" onclick="toggleCart(${index})">Add to Bundle</button>
        </div>
      </div>`;
  }).join('');
}

function toggleCart(index) {
  const exists = cart.find(item => item.id === product[index].id);
  if (exists) {
    const i = cart.findIndex(item => item.id === product[index].id);
    cart.splice(i, 1);
  } else {
    cart.push(product[index]);
  }
  updateUI();
}

function updateUI() {
  document.getElementById("count").innerText = cart.length;
  document.getElementById("progress").innerText = `(${cart.length}/3)`;
  const btn = document.getElementById("checkoutBtn");

  // Update button styles
  product.forEach((item, index) => {
    const button = document.getElementById(`btn-${index}`);
    if (cart.find(i => i.id === item.id)) {
      button.innerText = "Remove from Bundle";
      button.style.backgroundColor = "#333";
    } else {
      button.innerText = "Add to Bundle";
      button.style.backgroundColor = "goldenrod";
    }
  });

  if (cart.length === 0) {
    document.getElementById('cartItem').innerHTML = "Your cart is empty";
    document.getElementById("total").innerHTML = "$ 0.00";
    btn.classList.remove("active");
    btn.disabled = true;
    btn.style.backgroundColor = "#ccc";
  } else {
    let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let discount = cart.length >= 3 ? subtotal * 0.3 : 0;
    let finalTotal = subtotal - discount;

    document.getElementById("cartItem").innerHTML = cart.map((item, j) => {
      return `
        <div class='cart-item'>
          <div class='row-img'>
            <img class='rowimg' src="${item.image}" />
          </div>
          <p style='font-size:12px;'>${item.title}</p>
          <h2 style='font-size:15px;'>$ ${item.price}.00</h2>
          <i class='fa-solid fa-trash' onclick='removeItem(${j})'></i>
        </div>`;
    }).join('');
    document.getElementById("total").innerHTML = `$ ${finalTotal.toFixed(2)}`;

    if (cart.length >= 3) {
      btn.disabled = false;
      btn.classList.add("active");
    } else {
      btn.disabled = true;
      btn.classList.remove("active");
    }
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  updateUI();
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length >= 3) {
    console.log("Selected Bundle:", cart);
    alert("Bundle added! Check console.");
  }
});

renderProducts();
updateUI();

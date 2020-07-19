let username
let socket = io()

do {
  username=prompt('enter your name')
} while(!username)

const textarea = document.querySelector('#textarea')

const submitBtn = document.querySelector('#submitBtn')

const commentBox = document.querySelector('.comment__box')

submitBtn.addEventListener('click',(e) => {
  e.preventDefault()
  let comment = textarea.value
  
  if(!comment) {
    return
  }
  postComment(comment)
})
function postComment(comment) {
  // Append to DOM

  let data = {
    username: username,
    comment: comment
  }
  
  appendToDOM(data)
  textarea.value=""
  // Broadcast
  broadcastComment(data)

  // Sync with Mongo DB
}

function appendToDOM(data) {
  
  let liTag = document.createElement('li')
  liTag.classList.add('comment','mb-3')

  let markup = `<div class="card border-light mb-3">
                  <div class="card-body">
                    <h6>${data.username}</h6>
                    <p>${data.comment}</p>
                  <div>
                    <img src="img/clock.png" alt="clock">
                    <small>${moment(data.time).format('LT')}</small>
                  </div>
                </div>
              </div>`
  liTag.innerHTML = markup
  commentBox.prepend(liTag);

}

function broadcastComment(data) {
  // Socket
  socket.emit('comment',data) 
}

socket.on('comment',(data)=>{
  appendToDOM(data)
})

let timerId = null
function debounce(func, timer) {
  if(timerId) {
    clearTimeout(timerId)
  }
  timerId = setTimeout(()=>{
    func()
  }, timer)
}

let typingDiv = document.querySelector('.typing')
socket.on('typing', (data) => {
  typingDiv.innerText = `${data.username} is typing ...`

  debounce( () => {

    typingDiv.innerText = ''

  }, 1000)
  
})

// Event Listner on textarea
textarea.addEventListener('keyup', (e) => {
  socket.emit('typing', { username })
})
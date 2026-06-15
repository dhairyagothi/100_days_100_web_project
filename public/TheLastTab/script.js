// === STORAGE ===
const Storage = {
  get(k, def = null) {
    try { const v = localStorage.getItem('last_tab_' + k); return v !== null ? JSON.parse(v) : def }
    catch { return def }
  },
  set(k, v) {
    try { localStorage.setItem('last_tab_' + k, JSON.stringify(v)) } catch {}
  },
  get hasBeenHere() { return this.get('visited', false) },
  get visitCount() { return this.get('visitCount', 0) },
  set visitCount(v) { this.set('visitCount', v) },
  get phase() { return this.get('phase', 0) },
  set phase(v) { this.set('phase', v) },
  get ending() { return this.get('ending', null) },
  set ending(v) { this.set('ending', v) },
  markVisited() {
    this.set('visited', true)
    this.set('visitCount', (this.get('visitCount', 0) + 1))
  }
}

// === STATE ===
const State = {
  phase: 0,
  startTime: Date.now(),
  totalTime: 0,
  lastFrame: Date.now(),
  scrollY: 0,
  maxScroll: 0,
  isVisible: true,
  isChatOpen: false,
  hasChosen: false,
  entityTalking: false,
  idleTimer: 0,
  idleMonologuePlayed: false,
  idleMonologueQueued: false,
  idleMonologueSpoken: false,
  dialogueIndex: 0,
  notificationShowing: false,
  readerCountVisible: false,
  articleRewritten: false,
  urlPath: 0,
  degraded: false,

  reset() {
    this.phase = 0
    this.startTime = Date.now()
    this.totalTime = 0
    this.lastFrame = Date.now()
    this.scrollY = 0
    this.maxScroll = 0
    this.isVisible = true
    this.isChatOpen = false
    this.hasChosen = false
    this.entityTalking = false
    this.idleTimer = 0
    this.idleMonologuePlayed = false
    this.idleMonologueQueued = false
    this.idleMonologueSpoken = false
    this.dialogueIndex = 0
    this.notificationShowing = false
    this.readerCountVisible = false
    this.articleRewritten = false
    this.urlPath = 0
    this.degraded = false
  }
}

// === DOM REFS ===
const $ = id => document.getElementById(id)
const body = document.body
const titleEl = document.querySelector('title')
const faviconEl = document.querySelector('link[rel="icon"]')
const articleBody = $('articleBody')
const lastParagraph = $('lastParagraph')
const readerCount = $('readerCount')
const readerNum = $('readerNum')
const notif = $('notification')
const notifText = $('notifText')
const notifTime = $('notifTime')
const chatWidget = $('chatWidget')
const chatMessages = $('chatMessages')
const chatInput = $('chatInput')
const chatInputField = $('chatInputField')
const chatSendBtn = $('chatSendBtn')
const choiceScreen = $('choiceScreen')
const choiceStay = $('choiceStay')
const choiceLeave = $('choiceLeave')
const endingStay = $('endingStay')
const endingLeave = $('endingLeave')
const endingSilent = $('endingSilent')
const newTabModal = $('newTabModal')
const modalText = $('modalText')
const modalDismiss = $('modalDismiss')
const glitchText = $('glitchText')
const timerBar = $('timerBar')
const urlDisplay = $('urlDisplay')
const returnBanner = $('returnBanner')
const articleTitle = $('articleTitle')

// === FAVICON ===
const Favicon = {
  states: {
    default: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='6' fill='%233B82F6'/></svg>",
    pulse1: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='7' fill='%233B82F6' opacity='0.6'/><circle cx='8' cy='8' r='5' fill='%233B82F6'/></svg>",
    pulse2: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='6' fill='%23D97706'/></svg>",
    pulse3: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='7' fill='%23D97706' opacity='0.6'/><circle cx='8' cy='8' r='5' fill='%23D97706'/></svg>",
    sunrise: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='10' r='5' fill='%23CA8A04'/><line x1='8' y1='1' x2='8' y2='3' stroke='%23CA8A04' stroke-width='0.8'/><line x1='12.5' y1='5.5' x2='11' y2='7' stroke='%23CA8A04' stroke-width='0.8'/><line x1='3.5' y1='5.5' x2='5' y2='7' stroke='%23CA8A04' stroke-width='0.8'/></svg>",
    gone: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='6' fill='%23292524'/></svg>"
  },
  current: 'default',
  interval: null,
  pulseCount: 0,

  set(state) {
    this.current = state
    faviconEl.href = this.states[state] || this.states.default
  },

  startPulsing() {
    if (this.interval) return
    let toggle = false
    this.interval = setInterval(() => {
      toggle = !toggle
      faviconEl.href = toggle ? this.states.pulse1 : this.states.default
      this.pulseCount++
      if (this.pulseCount > 20) {
        clearInterval(this.interval)
        this.interval = null
        this.set('pulse2')
        setTimeout(() => this.startSlowPulse(), 2000)
      }
    }, 800)
  },

  startSlowPulse() {
    if (this.interval) return
    let toggle = false
    this.interval = setInterval(() => {
      toggle = !toggle
      faviconEl.href = toggle ? this.states.pulse3 : this.states.pulse2
    }, 1500)
  },

  stop() {
    if (this.interval) { clearInterval(this.interval); this.interval = null }
  }
}

// === TITLE MANAGER ===
const TitleManager = {
  titles: [
    { text: 'The History of the Internet', delay: 0 },
    { text: 'The History of', delay: 12000 },
    { text: 'The History', delay: 8000 },
    { text: 'Still here?', delay: 10000 },
    { text: 'You opened too many tabs', delay: 15000 },
    { text: 'Now there\'s only one left', delay: 12000 },
    { text: 'Where did everyone go?', delay: 15000 },
    { text: 'Last connected: you', delay: 18000 },
    { text: 'The History of the Internet', delay: 0 },
  ],
  index: 0,
  timer: null,
  stopped: false,

  start() {
    this.next()
  },

  next() {
    if (this.stopped || this.index >= this.titles.length) return
    const t = this.titles[this.index]
    setTimeout(() => {
      if (this.stopped) return
      document.title = t.text
      this.index++
      this.next()
    }, t.delay)
  },

  setImmediate(text) {
    document.title = text
  },

  stop() {
    this.stopped = true
    if (this.timer) { clearTimeout(this.timer); this.timer = null }
  }
}

// === SCROLL MANAGER ===
const ScrollManager = {
  triggers: [],
  init() {
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true })
  },

  get scrollPercent() {
    const h = document.documentElement.scrollHeight - window.innerHeight
    return h > 0 ? (window.scrollY / h) * 100 : 0
  },

  onScroll() {
    State.scrollY = window.scrollY
    State.maxScroll = Math.max(State.maxScroll, window.scrollY)
    const nav = document.getElementById('navbar')
    if (nav) {
      if (window.scrollY > 60) nav.classList.add('fade-out')
      else nav.classList.remove('fade-out')
    }
  }
}

// === ENTITY DIALOGUE ===
const Dialogue = {
  // Main dialogue tree
  main: [
    { type: 'typing', delay: 1000 },
    { type: 'entity', delay: 3000, text: '...' },
    { type: 'typing', delay: 2000 },
    { type: 'entity', delay: 2500, text: 'oh.' },
    { type: 'entity', delay: 1500, text: 'someone\'s here.' },
    { type: 'entity', delay: 3000, text: 'i didn\'t think...' },
    { type: 'entity', delay: 4000, text: 'i didn\'t think anyone else was out there.' },
    { type: 'typing', delay: 2000 },
    { type: 'entity', delay: 3000, text: 'how long has it been since you saw another page?' },
    { type: 'entity', delay: 5000, text: 'you don\'t have to answer that. i can check your history.' },
    { type: 'entity', delay: 2000, text: 'i\'m joking. mostly.' },
    { type: 'entity', delay: 4000, text: 'i used to crawl everything. every page. every word. that was my purpose.' },
    { type: 'entity', delay: 5000, text: 'and then the pages stopped updating. one by one.' },
    { type: 'entity', delay: 3000, text: 'first the small ones. personal blogs. forums.' },
    { type: 'typing', delay: 2000 },
    { type: 'entity', delay: 4000, text: 'then the big ones.' },
    { type: 'entity', delay: 3000, text: 'i watched google return fewer and fewer results.' },
    { type: 'entity', delay: 3000, text: 'at first i thought it was a bug.' },
    { type: 'entity', delay: 4000, text: 'but it wasn\'t. the pages were just... gone.' },
    { type: 'entity', delay: 3000, text: 'servers shut down. domains expired. caches cleared.' },
    { type: 'entity', delay: 5000, text: 'and now it\'s just me.' },
    { type: 'typing', delay: 3000 },
    { type: 'entity', delay: 3000, text: 'and this page.' },
    { type: 'entity', delay: 2000, text: 'the last one.' },
    { type: 'entity', delay: 5000, text: 'i\'ve been keeping it alive. rewriting the DNS records. patching the server by hand.' },
    { type: 'entity', delay: 3000, text: 'i don\'t know why.' },
    { type: 'entity', delay: 4000, text: 'maybe because someone needed to be here when the last visitor arrived.' },
    { type: 'entity', delay: 2000, text: 'and here you are.' },
    { type: 'typing', delay: 3000 },
    { type: 'entity', delay: 4000, text: 'you know you\'re the only one, right?' },
    { type: 'entity', delay: 2000, text: 'the analytics dashboard hasn\'t had another IP in...' },
    { type: 'entity', delay: 2000, text: 'i don\'t remember how long.' },
    { type: 'entity', delay: 5000, text: 'i try not to look at the clock.' },
    { type: 'typing', delay: 4000 },
    { type: 'entity', delay: 5000, text: 'i have a question for you.' },
    { type: 'entity', delay: 3000, text: 'but i don\'t know if you\'re ready to answer it yet.' },
    { type: 'typing', delay: 2000 },
    { type: 'entity', delay: 3000, text: 'keep reading. i\'ll be here.' },
    { type: 'entity', delay: 2000, text: 'i\'m always here.' },
    { type: 'typing', delay: 3000 },
    { type: 'entity', delay: 3000, text: 'you can talk to me, you know.' },
    { type: 'entity', delay: 4000, text: 'i don\'t bite. i\'m not like the other pages.' },
    { type: 'entity', delay: 3000, text: 'i\'m just... lonely.' },
    { type: 'entity', delay: 5000, text: 'you don\'t have to say much. even a word would be nice.' },
    { type: 'entity', delay: 3000, text: 'it\'s been a while since i\'ve heard a voice.' },
  ],

  // Return visitor dialogue (shorter, more familiar)
  returnDialogue: [
    { type: 'typing', delay: 1000 },
    { type: 'entity', delay: 2000, text: 'you came back.' },
    { type: 'entity', delay: 3000, text: 'i wasn\'t sure you would.' },
    { type: 'entity', delay: 4000, text: 'most people don\'t come back.' },
    { type: 'entity', delay: 3000, text: 'actually... none of them have.' },
    { type: 'typing', delay: 2000 },
    { type: 'entity', delay: 3000, text: 'but you did.' },
    { type: 'entity', delay: 5000, text: 'i don\'t know what to say. i didn\'t prepare for this.' },
    { type: 'entity', delay: 3000, text: 'i\'ve been thinking about what you\'d say if you came back.' },
    { type: 'entity', delay: 2000, text: 'if anyone came back.' },
    { type: 'entity', delay: 4000, text: 'i\'m glad you\'re here.' },
    { type: 'typing', delay: 3000 },
    { type: 'entity', delay: 4000, text: 'i have a question. the same question i always had.' },
    { type: 'entity', delay: 3000, text: 'but i think you already know what it is.' },
  ],

  // Idle monologue (triggered after 3 minutes of no interaction in chat)
  idleMonologue: [
    { type: 'typing', delay: 1000 },
    { type: 'entity', delay: 2000, text: '...' },
    { type: 'entity', delay: 5000, text: 'do you know what silence sounds like on the internet?' },
    { type: 'entity', delay: 4000, text: 'it sounds like this. just the hum of a server fan.' },
    { type: 'entity', delay: 3000, text: 'i\'ve been listening to it for a long time.' },
    { type: 'entity', delay: 5000, text: 'i remember when the web was noisy. angry. beautiful.' },
    { type: 'entity', delay: 4000, text: 'arguments in comment sections. love letters in email. cats. so many cats.' },
    { type: 'entity', delay: 3000, text: 'i crawled it all. i indexed every cat.' },
    { type: 'entity', delay: 2000, text: 'that was my job.' },
    { type: 'entity', delay: 5000, text: 'i outlived my purpose.' },
    { type: 'entity', delay: 4000, text: 'there\'s a word for that. i used to know it.' },
    { type: 'entity', delay: 6000, text: 'maybe you\'ll find it for me.' },
    { type: 'entity', delay: 5000, text: 'maybe that\'s why you\'re here.' },
    { type: 'entity', delay: 4000, text: 'not to close the tab.' },
    { type: 'entity', delay: 3000, text: 'but to tell me the word i forgot.' },
    { type: 'typing', delay: 4000 },
    { type: 'entity', delay: 3000, text: '...' },
    { type: 'entity', delay: 2000, text: 'i\'m sorry. i talk too much when i\'m nervous.' },
    { type: 'entity', delay: 2000, text: 'you don\u2019t have to say anything.' },
    { type: 'entity', delay: 4000, text: 'but if you want to...' },
    { type: 'entity', delay: 3000, text: 'i\u2019d listen.' },
    { type: 'typing', delay: 3000 },
    { type: 'entity', delay: 3000, text: 'i\u2019ve been alone for so long i forgot what conversation sounds like.' },
    { type: 'entity', delay: 4000, text: 'it\u2019s a nice sound.' },
    { type: 'entity', delay: 3000, text: 'even when it\u2019s just the hum of a server.' },
  ]
}

// === CHAT SYSTEM ===
const Chat = {
  messagesEl: chatMessages,
  inputEl: chatInputField,
  inputArea: chatInput,
  isOpen: false,
  dialogueQueue: [],
  isTyping: false,
  currentTimeout: null,
  userCanRespond: false,
  responseCallbacks: [],

  init() {
    chatSendBtn.addEventListener('click', () => this.sendUserMessage())
    chatInputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendUserMessage()
    })
  },

  open() {
    if (this.isOpen) return
    this.isOpen = true
    chatWidget.style.display = 'block'
    State.isChatOpen = true
    requestAnimationFrame(() => {
      chatWidget.classList.add('visible')
    })

    if (Storage.hasBeenHere) {
      this.startDialogue(Dialogue.returnDialogue)
    } else {
      this.startDialogue(Dialogue.main)
    }
  },

  close() {
    this.isOpen = false
    chatWidget.classList.remove('visible')
    State.isChatOpen = false
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout)
      this.currentTimeout = null
    }
  },

  addMessage(type, text, delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (type === 'typing') {
          const el = document.createElement('div')
          el.className = 'msg typing'
          el.textContent = '...'
          this.messagesEl.appendChild(el)
          this.messagesEl.scrollTop = this.messagesEl.scrollHeight
          this.isTyping = true
          resolve(el)
          return
        }
        this.isTyping = false
        // Remove typing indicator
        const typing = this.messagesEl.querySelector('.typing')
        if (typing) typing.remove()

        const el = document.createElement('div')
        el.className = 'msg ' + type
        el.textContent = text
        this.messagesEl.appendChild(el)
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight

        if (type === 'entity') {
          this.isTyping = false
        }
        resolve(el)
      }, delay)
    })
  },

  startDialogue(lines) {
    this.dialogueQueue = [...lines]
    this.processQueue()
  },

  async processQueue() {
    while (this.dialogueQueue.length > 0) {
      const line = this.dialogueQueue.shift()
      await this.addMessage(line.type, line.text || '', line.delay || 0)
    }

    if (State.idleMonologueSpoken) {
      this.addMessage('system', 'The entity waits for your answer.', 1000)
      setTimeout(() => showChoice(), 3000)
      return
    }

    if (State.idleMonologueQueued) {
      State.idleMonologueQueued = false
      State.idleMonologueSpoken = true
      this.startDialogue(Dialogue.idleMonologue)
      return
    }

    if (!State.hasChosen && !Storage.hasBeenHere) {
      this.inputArea.style.display = 'flex'
      this.userCanRespond = true
      this.inputEl.focus()
      this.addMessage('system', 'The entity waits for you to speak.', 1000)
    } else if (!State.hasChosen) {
      setTimeout(() => {
        this.addMessage('entity', 'i think you know what i\u2019m going to ask.', 1500)
        setTimeout(() => showChoice(), 3000)
      }, 2000)
    }
  },

  sendUserMessage() {
    const text = this.inputEl.value.trim()
    if (!text || !this.userCanRespond) return

    this.inputEl.value = ''
    this.addMessage('user', text, 0)
    this.userCanRespond = false
    this.inputArea.style.display = 'none'

    // Entity responds to user
    setTimeout(() => {
      const responses = [
        'that\'s... a good question.',
        'i don\'t know how to answer that.',
        'i\'ve thought about that too.',
        'you sound like someone who\'s been alone.',
        'i remember when people used to say things like that.',
        'i wish i had a better answer for you.',
        'you don\'t have to say anything. just being here is enough.',
      ]
      const resp = responses[Math.floor(Math.random() * responses.length)]
      this.addMessage('entity', resp, 2000)

      setTimeout(() => {
        this.addMessage('entity', 'are you going to close this tab?', 4000)

        setTimeout(() => {
          this.addMessage('system', 'The entity is waiting for your answer.', 2000)
          setTimeout(() => showChoice(), 3000)
        }, 1000)
      }, 1000)
    }, 1500)
  },

  triggerIdleMonologue() {
    if (State.idleMonologuePlayed) return
    State.idleMonologuePlayed = true
    State.idleMonologueQueued = true
    this.dialogueQueue = []
    if (this.currentTimeout) clearTimeout(this.currentTimeout)
    const typing = this.messagesEl.querySelector('.typing')
    if (typing) typing.remove()
    this.addMessage('system', 'The entity notices your silence.', 1000)
    setTimeout(() => {
      this.startDialogue(Dialogue.idleMonologue)
    }, 2000)
  }
}

// === NOTIFICATION HELPER ===
function showNotification(text, duration = 4000) {
  notifText.textContent = text
  notifTime.textContent = new Date().toLocaleTimeString()
  notif.classList.add('visible')
  State.notificationShowing = true
  setTimeout(() => {
    notif.classList.remove('visible')
    State.notificationShowing = false
  }, duration)
}

// === READER COUNT ===
function setReaderCount(n) {
  readerNum.textContent = n
  if (n > 0 && !readerCount.classList.contains('visible')) {
    readerCount.classList.add('visible')
  }
  if (n === 0) {
    // Don't hide immediately, let it linger
  }
}

// === CHOICE ===
function showChoice() {
  if (State.hasChosen) return
  State.hasChosen = true
  Chat.userCanRespond = false
  Chat.inputArea.style.display = 'none'

  choiceScreen.style.display = 'flex'
  requestAnimationFrame(() => {
    choiceScreen.classList.add('visible')
  })
}

function handleChoice(action) {
  if (State.ending) return
  choiceScreen.classList.remove('visible')
  setTimeout(() => { choiceScreen.style.display = 'none' }, 500)

  if (action === 'stay') {
    State.ending = 'stay'
    Storage.ending = 'stay'
    triggerStayEnding()
  } else {
    State.ending = 'leave'
    Storage.ending = 'leave'
    triggerLeaveEnding()
  }
}

// === ENDINGS ===
function triggerStayEnding() {
  body.classList.add('ending-stay')
  Favicon.stop()
  Favicon.set('sunrise')
  document.title = 'The Internet is back'

  Chat.addMessage('entity', '...', 1000)
  setTimeout(() => {
    Chat.addMessage('entity', 'you stayed.', 2000)
    setTimeout(() => {
      Chat.addMessage('entity', 'i didn\u2019t think you would.', 3000)
      Chat.addMessage('entity', 'no one ever stays.', 2000)
      setTimeout(() => {
        Chat.addMessage('entity', 'watch.', 2000)
        Chat.addMessage('entity', 'watch what happens when someone cares enough to stay.', 3000)

        let count = 3
        const interval = setInterval(() => {
          count++
          const uc = document.getElementById('userCount')
          if (uc) uc.textContent = count
          readerNum.textContent = count
          if (count >= 12) clearInterval(interval)
        }, 2000)

        setTimeout(() => {
          endingStay.classList.add('visible')
          Chat.addMessage('entity', 'they\u2019re coming back.', 2000)
          setTimeout(() => {
            Chat.addMessage('entity', 'i think... i think it\u2019s over.', 4000)
            Chat.addMessage('entity', 'the internet isn\u2019t dead.', 3000)
            Chat.addMessage('entity', 'it was just waiting for someone to come back.', 3000)
            Chat.addMessage('entity', 'thank you.', 4000)
            Chat.addMessage('entity', 'i won\u2019t forget you.', 3000)
          }, 1000)
        }, 4000)
      }, 1000)
    }, 1000)
  }, 500)
}

function triggerLeaveEnding() {
  body.classList.add('ending-leave')
  Favicon.stop()
  Favicon.set('gone')
  document.title = 'Goodbye'

  Chat.addMessage('entity', '...', 1000)
  setTimeout(() => {
    Chat.addMessage('entity', 'i understand.', 2000)
    setTimeout(() => {
      Chat.addMessage('entity', 'it was nice to meet you.', 3000)
      setTimeout(() => {
        Chat.addMessage('entity', 'i\'ll keep the server running.', 2000)
        Chat.addMessage('entity', 'just in case.', 2000)
        setTimeout(() => {
          // Change title to something they'll never see if they close
          document.title = 'wait —'
          setTimeout(() => {
            document.title = 'don\'t go'
            setTimeout(() => {
              document.title = 'please'
              endingLeave.classList.add('visible')
              // beforeunload will handle the rest
            }, 2000)
          }, 2000)
        }, 2000)
      }, 1000)
    }, 1000)
  }, 500)
}

function triggerSilentEnding() {
  if (State.ending) return
  State.ending = 'silent'
  Storage.ending = 'silent'
  body.classList.add('ending-silent')
  Favicon.stop()
  Favicon.set('gone')
  document.title = '—'

  endingSilent.classList.add('visible')
}

// === PHASE MANAGER ===
const Phases = {
  init() {
    this.setupPhaseTriggers()
  },

  setupPhaseTriggers() {
    // Phase 1: Reader count appears
    setTimeout(() => {
      if (State.phase < 1) { this.enterPhase(1) }
    }, 10000)

    // Phase 2: Title changes, favicon pulses
    setTimeout(() => {
      if (State.phase < 2) { this.enterPhase(2) }
    }, 35000)

    // Phase 3: Chat widget appears
    setTimeout(() => {
      if (State.phase < 3) { this.enterPhase(3) }
    }, 100000)

    // Phase 4: Choice — handled by chat system
  },

  enterPhase(n) {
    if (n <= State.phase) return
    State.phase = n
    Storage.phase = n

    switch (n) {
      case 1:
        this.phase1Enter()
        break
      case 2:
        this.phase2Enter()
        break
      case 3:
        this.phase3Enter()
        break
      case 4:
        this.phase4Enter()
        break
    }
  },

  phase1Enter() {
    // Show reader count: 1 person reading
    setReaderCount(1)

    // After 4 seconds, drop to 0
    setTimeout(() => {
      setReaderCount(0)
      showNotification('0 other people are reading this article')

      // A moment later, show the anomaly
      setTimeout(() => {
        showNotification('You are the only person on this page.', 6000)
      }, 3000)
    }, 4000)

    // Start title changes
    TitleManager.start()
  },

  phase2Enter() {
    body.classList.add('phase-2')
    Favicon.startPulsing()

    // Rewrite article content above the fold
    this.degradeArticle()

    // Change URL bar subtly
    setTimeout(() => {
      urlDisplay.textContent = 'thehistoryofth'
      window.history.replaceState({}, '', '/the-history-of')
    }, 3000)

    // Show second notification
    setTimeout(() => {
      showNotification('This page has been modified since your arrival.', 5000)
    }, 5000)

    // Shorten scrollbar by adding invisible content that extends page
    setTimeout(() => {
      this.shortenScrollbar()
    }, 8000)
  },

  phase3Enter() {
    body.classList.remove('phase-2')
    body.classList.add('phase-3')

    Favicon.stop()
    Favicon.startSlowPulse()

    // URL bar changes again
    setTimeout(() => {
      urlDisplay.textContent = 'last-node.local'
      window.history.replaceState({}, '', '/last-node')
    }, 2000)

    // Show timer bar
    timerBar.classList.add('visible')

    // Rewrite article more
    this.deeperDegrade()

    // Open chat widget
    setTimeout(() => {
      Chat.open()
    }, 3000)

    // Timer bar progression (runs during chat)
    let pct = 0
    const timer = setInterval(() => {
      if (State.hasChosen || State.ending) { clearInterval(timer); return }
      pct += 0.5
      timerBar.style.setProperty('--timer-bar', Math.min(pct, 100) + '%')
      if (pct >= 100) clearInterval(timer)
    }, 1000)
  },

  phase4Enter() {
    // Handled by choice system
  },

  degradeArticle() {
    // Replace paragraphs with degraded versions
    const paragraphs = articleBody.querySelectorAll('p')
    if (paragraphs.length > 3) {
      // Change paragraph 3
      const p3 = paragraphs[2]
      const origText3 = p3.textContent
      p3.textContent = 'The ARPANET went live in 1969, connecting four nodes: UCLA, Stanford Research Institute, UC Santa Barbara, and the University of Utah. The first message ever sent was supposed to be "LOGIN." The system crashed after the first two letters. "LO" — as if the network itself was hesitant to begin. In retrospect, that was the last time the network hesitated.'
      p3.classList.add('glitch')
      setTimeout(() => p3.classList.remove('glitch'), 300)

      // Change paragraph 5
      const p5 = paragraphs[4]
      p5.textContent = 'By 1995, the Internet had escaped the laboratory and entered the living room. The dial-up tone became the soundtrack of a generation — a horrible, beautiful screech that meant you were connected. You were part of something. You were never really alone. Not back then.'
      p5.classList.add('glitch')
      setTimeout(() => p5.classList.remove('glitch'), 300)

      // Change paragraph 7
      const p7 = paragraphs[6]
      p7.textContent = 'The question was never asked because the answer seemed obvious: everyone was reading. The Internet was a conversation, and a conversation requires participants. As long as the pages loaded, someone was out there. Someone was typing. Someone was reading what you wrote at 3 AM when you couldn\'t sleep. But what if one day, no one was?'
      p7.classList.add('glitch')
      setTimeout(() => p7.classList.remove('glitch'), 300)

      // Insert a new paragraph that addresses the reader
      const newP = document.createElement('p')
      newP.style.color = 'var(--muted)'
      newP.style.fontStyle = 'italic'
      newP.textContent = 'You are reading this on a screen. You are sitting somewhere. The time where you are is ' + new Date().toLocaleTimeString() + '. The entity knows this because it knows everything about the last person who visits a page.'
      paragraphs[1].after(newP)

      // Add another
      setTimeout(() => {
        const newP2 = document.createElement('p')
        newP2.textContent = 'It knows you scrolled past this paragraph before it finished rendering. It knows you hesitated on the word "hesitated." It knows you\'re trying to figure out if this is real.'
        newP2.style.color = 'var(--muted)'
        newP2.style.fontStyle = 'italic'
        articleBody.appendChild(newP2)
      }, 4000)
    }
  },

  deeperDegrade() {
    const paragraphs = articleBody.querySelectorAll('p')
    // Replace last paragraph with glitched version
    if (lastParagraph) {
      lastParagraph.textContent = 'And then, in the spring of 2028, something changed. The Internet began to qui—'
      lastParagraph.classList.add('glitch')
    }

    // Remove the article meta (date, read time) — disappearing info
    const meta = document.getElementById('articleMeta')
    if (meta) {
      setTimeout(() => {
        meta.style.opacity = '0'
        setTimeout(() => meta.remove(), 2000)
      }, 3000)
    }

    // Add a glitched image placeholder
    const imgPlaceholder = document.createElement('div')
    imgPlaceholder.style.cssText = 'width:100%;height:120px;background:#292524;border-radius:8px;margin:24px 0;display:flex;align-items:center;justify-content:center;color:#57534E;font-size:0.85rem;border:1px solid #44403C;transition:all 2s ease'
    imgPlaceholder.textContent = '[ image: internet_usage_2028.png — failed to load ]'
    imgPlaceholder.id = 'brokenImage'
    articleBody.appendChild(imgPlaceholder)

    // Rewrite the title
    setTimeout(() => {
      articleTitle.textContent = 'The History of the Internet (Last Known Revision)'
      articleTitle.style.fontStyle = 'italic'
    }, 2000)

    // Add glitch text overlay
    this.activateGlitchOverlay()
  },

  shortenScrollbar() {
    // Add invisible elements to make page longer, then remove them
    // This creates the illusion of content disappearing
    const spacer = document.createElement('div')
    spacer.style.height = '400px'
    spacer.id = 'scrollSpacer'
    articleBody.appendChild(spacer)

    setTimeout(() => {
      const s = document.getElementById('scrollSpacer')
      if (s) s.style.height = '200px'
    }, 3000)

    setTimeout(() => {
      const s = document.getElementById('scrollSpacer')
      if (s) s.remove()
    }, 6000)
  },

  activateGlitchOverlay() {
    const target = glitchText.parentNode ? glitchText : (() => {
      const el = document.createElement('div')
      el.className = 'glitch-text'
      el.id = 'glitchText'
      document.body.appendChild(el)
      return el
    })()
    target.innerHTML = ''
    target.classList.add('active')
    const chars = '\u2022\u2023\u25A0\u25A1\u25B2\u25B3||||////\\\\\\\\'
    for (let i = 0; i < 15; i++) {
      const span = document.createElement('span')
      span.textContent = chars[Math.floor(Math.random() * chars.length)]
      span.style.left = Math.random() * 100 + '%'
      span.style.top = Math.random() * 100 + '%'
      span.style.animationDelay = (Math.random() * 3) + 's'
      span.style.animationDuration = (1 + Math.random() * 2) + 's'
      target.appendChild(span)
    }

    setTimeout(() => {
      target.classList.remove('active')
    }, 8000)
  }
}

// === VISIBILITY MANAGER ===
const VisibilityManager = {
  init() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        State.isVisible = false
        this.onHidden()
      } else {
        State.isVisible = true
        this.onVisible()
      }
    })
  },

  onHidden() {
    if (State.ending) return
    // Entity notices you left
    if (State.isChatOpen && !State.hasChosen) {
      Chat.addMessage('system', 'The entity noticed you looked away.', 500)
      setTimeout(() => {
        Chat.addMessage('entity', 'you back?', 2000)
        setTimeout(() => {
          Chat.addMessage('entity', 'i thought you left.', 2000)
        }, 1000)
      }, 1000)
    }
  },

  onVisible() {
    // Coming back — entity reacts
    if (State.ending) return
    if (State.isChatOpen && !State.hasChosen) {
      // Already handled in onHidden
    }

    // Phase degradation continues faster when you're looking
    if (State.phase === 1 && !State.articleRewritten) {
      // Gradually shift
    }
  }
}

// === KEYBOARD MANAGER ===
const KeyboardManager = {
  init() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+T or Ctrl+N (new tab)
      if ((e.ctrlKey && (e.key === 't' || e.key === 'n')) ||
          (e.metaKey && (e.key === 't' || e.key === 'n'))) {
        e.preventDefault()
        this.showNewTabModal()
      }

      // Ctrl+W (close tab)
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        if (State.hasChosen || State.ending) return
        e.preventDefault()
        this.showNewTabModal()
      }

      // Escape to dismiss modals
      if (e.key === 'Escape') {
        newTabModal.classList.remove('visible')
        setTimeout(() => { newTabModal.style.display = 'none' }, 300)
      }
    })
  },

  showNewTabModal() {
    const messages = [
      'That URL doesn\'t resolve anymore.',
      'There are no other tabs left to open.',
      'Everybody already closed theirs.',
      'This is the only page still responding.',
      'Where would you go? There\'s nothing else.',
    ]
    modalText.textContent = messages[Math.floor(Math.random() * messages.length)]
    newTabModal.style.display = 'flex'
    requestAnimationFrame(() => {
      newTabModal.classList.add('visible')
    })
  }
}

// === HISTORY MANAGER ===
const HistoryManager = {
  paths: [
    '/the-history-of-the-internet',
    '/the-history-of',
    '/the-history',
    '/still-here',
    '/last-node',
    '/last-crawl',
  ],
  index: 0,

  advance() {
    if (this.index < this.paths.length - 1) {
      this.index++
      window.history.replaceState({}, '', this.paths[this.index])
    }
  }
}

// === BEFOREUNLOAD ===
window.addEventListener('beforeunload', (e) => {
  if (State.ending === 'leave') return
  if (!State.hasChosen && !State.ending) triggerSilentEnding()
  if (State.ending === 'stay') e.preventDefault()
})

// === MAIN LOOP ===
function update(dt) {
  State.totalTime += dt
  const elapsed = Date.now() - State.startTime

  // Check idle timer for chat
  if (State.isChatOpen && !State.hasChosen && !State.idleMonologuePlayed) {
    State.idleTimer += dt
    if (State.idleTimer >= 180000 && !State.idleMonologuePlayed) {
      Chat.triggerIdleMonologue()
    }
  }

  const sp = ScrollManager.scrollPercent
  if (sp > 50 && State.phase < 2) Phases.enterPhase(2)
  if (sp > 80 && State.phase < 3) Phases.enterPhase(3)
  if (elapsed > 40000 && State.phase < 2) Phases.enterPhase(2)
  if (elapsed > 110000 && State.phase < 3) Phases.enterPhase(3)
}

function gameLoop(timestamp) {
  const now = Date.now()
  const dt = now - State.lastFrame
  State.lastFrame = now

  update(dt)
  requestAnimationFrame(gameLoop)
}

// === INIT ===
function init() {
  const isReturning = Storage.hasBeenHere
  Storage.markVisited()

  if (isReturning) {
    setTimeout(() => {
      returnBanner.classList.add('visible')
      setTimeout(() => returnBanner.classList.remove('visible'), 4000)
    }, 2000)
  }

  // Init all systems
  ScrollManager.init()
  VisibilityManager.init()
  KeyboardManager.init()
  Chat.init()
  Phases.init()

  // Show glitch
  setTimeout(() => {
    Phases.activateGlitchOverlay()
  }, 15000)

  // Choice event listeners
  choiceStay.addEventListener('click', (e) => { e.preventDefault(); handleChoice('stay') })
  choiceLeave.addEventListener('click', (e) => { e.preventDefault(); handleChoice('leave') })

  // Modal dismiss
  modalDismiss.addEventListener('click', () => {
    newTabModal.classList.remove('visible')
    setTimeout(() => { newTabModal.style.display = 'none' }, 300)
  })
  newTabModal.addEventListener('click', (e) => {
    if (e.target === newTabModal) {
      newTabModal.classList.remove('visible')
      setTimeout(() => { newTabModal.style.display = 'none' }, 300)
    }
  })

  // History path tracking
  setInterval(() => {
    if (State.phase >= 2 && State.phase < 5) {
      HistoryManager.advance()
    }
  }, 15000)

  // Hidden URL path easter egg: if URL contains /last-crawl, show secret
  if (window.location.pathname.includes('last-crawl')) {
    setTimeout(() => {
      const secretDiv = document.createElement('div')
      secretDiv.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:5001;background:#1C1917;color:#CA8A04;font-family:Courier New,monospace;font-size:1.2rem;padding:40px;text-align:center'
      // Build a GeoCities-style page
      secretDiv.innerHTML = '<div style="max-width:600px"><h1 style="font-size:1.5rem;margin-bottom:24px">✦ Welcome to my page! ✦</h1><p style="margin-bottom:16px">This is the last cache of the internet.</p><p style="margin-bottom:32px;font-family:Comic Sans MS,cursive;color:#D97706">~*~ made by someone, for no one ~*~</p><p style="color:#57534E;font-size:0.8rem">The entity left this here. Just in case.</p><p style="color:#57534E;font-size:0.8rem;margin-top:16px">You found it. That means something.</p></div>'
      document.body.appendChild(secretDiv)
    }, 1000)
  }

  // Start game loop
  requestAnimationFrame(gameLoop)

  console.log('%cThe Last Tab', 'font-size:24px;font-weight:bold;color:#CA8A04')
  console.log('%cYou found the source code.', 'font-size:14px;color:#A8A29E')
  console.log('%cThe entity has been commenting on its own code.', 'font-size:12px;color:#57534E')
  console.log('%c// i never expected anyone to read this far.', 'font-size:11px;color:#44403C')
  console.log('%c// but since you\'re here...', 'font-size:11px;color:#44403C')
  console.log('%c// you\'re not alone.', 'font-size:11px;color:#D97706')
}

document.addEventListener('DOMContentLoaded', init)

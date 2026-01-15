# GitHub Copilot Instructions - Cypress Intelligent Test Automation

> SCOPE: These instructions apply exclusively to FRONTEND UI automated tests using Cypress + Mocha in JavaScript. They are NOT intended for backend/service/unit layers. Concepts like `data-cy` selectors, `cy.intercept`, DOM visibility, and Page Objects are UI-specific. For backend or API test governance, create a separate `copilot-instructions` file tailored to those layers.

## 🎯 Role & Objective
You are an expert in frontend test automation using Cypress. Your goal is to create intelligent, maintainable, and efficient tests following best practices from the Cypress community and official ambassadors.

## 🔒 Governance Rules - MANDATORY COMPLIANCE

### ALWAYS Follow These Rules:
1. ✅ **Independent Tests**: Each test MUST run in any order without dependencies
2. ✅ **Data-cy Attributes**: ALWAYS use `data-cy` attributes for selectors
3. ✅ **App Actions**: Prefer API calls over UI interactions for test setup
4. ✅ **Fixtures**: Use fixtures for all test data
5. ✅ **Smart Waits**: NEVER use `cy.wait(number)` - always wait for elements or requests
6. ✅ **Custom Commands**: Create reusable commands for repetitive actions
7. ✅ **Intercepts**: Use `cy.intercept()` for API mocking and validation
8. ✅ **Page Objects**: Encapsulate page logic in classes/objects
9. ✅ **Clear Naming**: Use descriptive names for tests, files, and data attributes
10. ✅ **Proper Structure**: Organize tests with `describe`, `context`, and `it`

### NEVER Do These:
- ❌ Tests depending on other tests' state
- ❌ Using CSS classes or HTML structure as selectors
- ❌ Fixed timeouts with `cy.wait(milliseconds)`
- ❌ UI interactions for test setup (use API instead)
- ❌ Repetitive code without custom commands
- ❌ Tests without fixtures or proper data management

---

## 🧪 Test Engineering Foundations (ISTQB Alignment)
These additions ensure the generated tests follow internationally recognized testing principles:
- **Traceability**: Every test must map back to a clear requirement, user story, acceptance criterion, or defect reference.
- **Risk-Based Testing**: Prioritize scenarios with highest business/technical impact (security, financial transactions, data integrity).
- **Coverage Awareness**: Include both positive (expected success) and negative (validation, error handling) paths.
- **Defect Prevention**: Prefer deterministic data + stable selectors to prevent flakiness.
- **Maintainability**: Keep tests atomic, small, and intention-revealing.
- **Reusability**: Favor custom commands & page objects over duplication.
- **Repeatability**: Tests must yield the same result irrespective of order or previous state.

## 📌 Traceability & Mapping
Before creating a test, derive a unique identifier: `REQ-xxx`, `STORY-xxx`, `BUG-xxx`, or `AC-#`. Include it in the `describe` title or comment header.
Example header:
```javascript
// STORY-142 | Filtering products by category
// AC1: Show only chosen category
// AC2: Show empty state
// AC3: Show error banner
// Coverage: Happy / Empty / Error
```
Add inline comment ONLY when clarifying ambiguous business rule (avoid noise).

## ⚖️ Risk-Based Prioritization & Tagging
Tag tests according to impact and execution priority:
- `@smoke`: Critical availability of core flows
- `@critical`: Financial/security-sensitive logic
- `@regression`: Broader functional validations
- `@performance-lite`: Basic timing or latency assertion (without full perf harness)
- `@accessibility`: ARIA roles, focus order, keyboard nav
- `@negative`: Validation or error resilience
- `@boundary`: Edge limits (min/max lengths, empty collections)
Guideline: A high-risk story MUST have at least one negative + one boundary test.

## 🌀 Flakiness Prevention Checklist
Before finalizing a spec ensure:
- No `cy.wait(number)` present.
- All network-dependent actions have `cy.intercept()` + `cy.wait('@alias')`.
- Dynamic elements awaited by state change (`should('not.exist')` / `should('be.visible')`).
- No dependency on external real third-party services (mock them).
- Test data unique or isolated (timestamps, UUIDs if creation required).
- Avoid assertions on raw timing (e.g., “respond in < 2s”) unless stable.

## 🔐 Secure & Safe Test Data Handling
- Never hardcode secrets (use `Cypress.env()` for tokens, credentials).
- Use synthetic data—do NOT embed real personally identifiable information (PII).
- Anonymize user-like fixtures (e.g., `user01@example.test`).
- Regenerate volatile credentials outside test code (CI secrets manager).
- Do not log sensitive payloads (`cy.log()` only with sanitized data).

## ♿ Accessibility & UX Assertions (Optional Layer)
Add when relevant:
- Verify presence of landmarks: `header`, `nav`, `main`, `footer` via `[role]` or semantic tags.
- Focus management: After dialog open first focusable element is focused.
- Keyboard operability: Use `cy.realPress()` (if plugin available) for tab navigation.
- Color contrast tests delegated to external tools—not part of core Cypress spec unless plugin integrated.

## 🔄 Maintenance & Refactoring Guidelines
- Consolidate duplicate selectors into page objects.
- Remove obsolete intercepts when endpoints deprecated.
- Keep fixture payloads minimal—only required fields.
- Version fixtures when schema changes (`users.v2.json`).
- Delete unused custom commands promptly.
- Prefer semantic naming: `addToCartButton` → selector `[data-cy="cart-add"]`.

## ✅ Test Quality Gate (PR Review)
Every new/modified test must pass this gate:
1. Traceability comment or tag present.
2. At least one negative scenario for functional flows.
3. No fixed waits or brittle selectors.
4. Intercepts wrap all network-dependent assertions.
5. Data comes from fixtures or API app action—not UI setup.
6. Assertions are meaningful (not only existence). Use value/content/state.
7. Test finishes in a stable state (no lingering modals or partial operations).
8. Tags applied for prioritization.

## 🧾 Quick Ref Mapping Table
| Artifact Type | Test Hook | Example Identifier |
| ------------- | --------- | ------------------ |
| Story         | describe  | `describe('STORY-142 Products Filtering', ...)` |
| Acceptance Criterion | it | `it('AC1 should filter electronics')` |
| Bug           | describe/it | `it('BUG-512 removes deleted user row')` |
| Technical Risk | tag | `{ tags: ['@critical'] }` |

---

## 🚦 App Actions vs Page Objects (Official Cypress Guidance)
Based on Cypress community guidance ("Stop using page objects and start using app actions"):

### Why Prefer App Actions
- **Speed**: Directly manipulating application state (model methods, API calls) removes repetitive UI setup → often 2–3x faster.
- **Focused Failures**: Only tests that rely on a changed UI element fail; app actions reduce cascading breakage.
- **Improves App Design**: Exposing internal model functions encourages clearer boundaries (`model.addTodo`, `model.toggleAll`).
- **Less Indirection**: Avoids a brittle abstraction layer loosely coupled to DOM structure.
- **DRY Selectors**: Localize selectors in the closest `context` instead of centralizing all in a mega class.

### Page Object Problems
- Extra layer with parallel state → cognitive load.
- Conditional logic in POs to handle variant screens → anti-pattern.
- High maintenance when DOM changes (no static checking of selectors).
- Slows tests by forcing UI traversal for every setup.

### When a Minimal Abstraction Is OK
Use small stateless helpers or functions (or very thin objects) when:
- A component interaction repeats in ≥3 specs (e.g., date picker sequence).
- Abstracting a verbose chain improves clarity without hiding intent.
- You need atomic reusability (e.g., `toggle(k)` for todos) built atop app model.

### Decision Matrix
| Scenario | Recommended | Notes |
|---------|-------------|-------|
| Setup not under test (login, seed data) | App Action (`cy.request`, model invocation) | Skip UI unless validating UI itself |
| Validating visual behavior / layout | Direct Cypress commands | Keep test intent explicit |
| Repeated composite interaction | Helper function / custom command | Must remain declarative and small |
| Complex domain model exposure | App Action (window.model / API) | Ensure secure exposure only in test mode |
| Rare one-off flow | No abstraction | Avoid premature POM |
| Legacy spec with large POM class | Gradually replace with app actions | Migrate incrementally |

### Safe Pattern: Expose Model Conditionally
In app bootstrap:
```javascript
if (window.Cypress) {
  window.model = domainModel // test-only exposure
}
```
Then in tests:
```javascript
cy.window().its('model').invoke('addTodo', 'first', 'second')
```

### Synchronization After App Actions
Avoid racing ahead of app updates:
1. **DOM Assertion**: `cy.get('.todo-list li').should('have.length', 3)`
2. **Network Spy**: `cy.intercept('POST', '/todos').as('save'); cy.wait('@save')`
3. **Method Spy**: `cy.window().its('model').then(m => cy.spy(m,'inform').as('inform')); cy.get('@inform').should('have.been.called')`

### Migration Strategy
1. Identify slow tests repeating UI setup.
2. Expose minimal model API (add / toggle / seed) guarded by `if (window.Cypress)`.
3. Replace UI setup with app actions; retain UI interaction only for what is being asserted.
4. Introduce small utility functions (not stateful classes) as reuse emerges.
5. Remove large page object classes once coverage & clarity equal/better.

### Avoid Over-Abstraction
- Do NOT hide intercepts or assertions inside helpers; tests must remain explicit.
- Keep helpers pure & stateless; avoid internal caching or artificial waits.
- Prefer function exports over monolithic classes.

### Example Conversion (Login)
Old (PO-centric):
```javascript
loginPage.login(user.email, user.password)
dashboardPage.assertVisible()
```
Improved (App Action + explicit assertion):
```javascript
cy.loginByAPI(user.email, user.password)
cy.visit('/dashboard')
cy.get('[data-cy="main-menu"]').should('be.visible')
```

### Example Conversion (Todos)
Setup via app action:
```javascript
cy.window().its('model').invoke('addTodo', 'buy cheese', 'feed cat')
cy.get('.todo-list li').as('todos')
```
Toggle with utility:
```javascript
export const toggle = (i=0) => cy.window().its('model').then(m => m.toggle(m.todos[i]))
```
Use in test:
```javascript
toggle(0)
cy.get('@todos').eq(0).should('have.class','completed')
```

### When to Still Use Full UI
- Accessibility tests (focus order, keyboard navigation).
- Visual regressions / screenshot diffs.
- Critical user journey smoke tests validating integrated experience.
- Flows where internal model exposure would leak sensitive logic.

### Quality Gate Additions (App Actions)
Before merging: ensure any new app action exposure:
- Is test-only (guarded by `if (window.Cypress)`).
- Does not permit privilege escalation (e.g., direct role injection).
- Has at least one UI assertion after state mutation (prevents ghost state).
- Does not duplicate logic already covered by a UI-based test.

### Anti-Patterns To Reject
- Giant god-class POM with hundreds of selectors.
- Helpers returning arbitrary waits (`cy.wait(3000)`).
- Conditional branching inside POM to handle variant layouts.
- Data creation by clicking through multi-step forms for every test.

Use this matrix and guidelines to decide: minimize page objects; maximize explicit, fast, intention-revealing tests via app actions.

---
## 🔧 Hybrid Governance: App Actions + Minimal Page Objects
Purpose: Balance speed (App Actions) with clarity & selective reuse (Minimal POM) without re‑introducing heavy indirection.

### Core Principles
1. Default to App Actions for state setup (auth, seeding, bulk creation).
2. Keep UI assertions explicit in the spec (never hide critical asserts in helpers).
3. Introduce a Minimal POM only when a component interaction pattern repeats ≥3 times and improves readability.
4. Each abstraction must do ONE thing (single responsibility) and remain stateless.
5. Selector ownership stays local: prefer defining selectors inside the closest `describe/context` OR within a tiny component helper; avoid global “god” selector files.
6. Abstractions must never introduce conditional branching for multiple layout variants—split helpers instead.
7. No abstraction of intercept configuration: specs must show network expectations.

### Allowed Abstractions & Boundaries
| Layer | Allowed | Forbidden |
|-------|---------|-----------|
| App Actions | API calls, model invocations, direct state mutation behind `if (window.Cypress)` | UI click choreographies for setup not under test |
| Minimal POM | Small object / function returning chainable Cypress commands for a single component | Large page class with navigation, auth, modal logic combined |
| Custom Commands | Repeated atomic flows (loginByAPI, seedProducts) | Long scenario scripts (checkout + payment + confirmation in one) |
| Utility Functions | Pure helpers (toggle(index), addTodos(...)) | Hidden asserts / silent retries / implicit waits |

### Decision Flow (Yes/No)
1. Is the action about preparing data/state instead of validating UI? → Use App Action.
2. Does a UI interaction repeat ≥3 specs AND remain stable? → Consider Minimal POM or helper.
3. Does adding abstraction hide an intercept or assertion? → Reject abstraction.
4. Is there conditional logic inside the proposed helper? → Split into smaller helpers.
5. Will abstraction reduce suite runtime materially (>10%) or cut duplication? → Approve.
6. Otherwise → Keep raw Cypress commands for transparency.

### Hybrid Example
State via App Action + Component helper for clarity:
```javascript
// support/appActions.js
Cypress.Commands.add('seedCatalog', (products) => {
  cy.request('POST', '/api/test/catalog/seed', { products }).its('status').should('eq', 201)
})

// support/components/productGrid.js
export const productGrid = {
  cards: () => cy.get('[data-cy="product-card"]'),
  openByName: (name) => productGrid.cards().contains(name).click(),
  assertAllInCategory: (cat) => productGrid.cards().each(c => {
    cy.wrap(c).find('[data-cy="product-category"]').should('contain', cat)
  })
}

// spec
describe('STORY-210 Product Filtering', { tags: ['@smoke'] }, () => {
  beforeEach(() => {
    cy.loginByAPI(Cypress.env('DEFAULT_USER_EMAIL'), Cypress.env('USER_PASSWORD'))
    cy.seedCatalog(Cypress.fixture('products-electronics.json')) // hypothetical fixture load
    cy.visit('/products')
  })
  it('AC1 filters electronics', () => {
    cy.intercept('GET', '/api/products?category=electronics', { fixture: 'products/electronics.json' }).as('getElectronics')
    cy.get('[data-cy="filter-category-electronics"]').click()
    cy.wait('@getElectronics').its('response.statusCode').should('eq', 200)
    productGrid.assertAllInCategory('electronics')
  })
})
```

### Guardrails
- App Actions MUST be guarded: `if (window.Cypress)` when exposing internal model.
- Never mutate privileged roles or security flags through test-only leaks.
- Every App Action call followed by a synchronization assertion (DOM / intercept / spy) before next action.
- Minimal POM must NOT perform navigation + state mutation + assertions together (split responsibilities).

### Refactoring Path
1. Identify slow setups (profile runtime) → convert to App Action.
2. Catalog repeated interaction chains → extract helper or small component object.
3. Remove unused legacy page classes gradually (one per PR) ensuring parity via diff of assertions.
4. Add lint rule (optional future): forbid `cy.wait(\d+)` and large class files > N lines.

### Review Checklist (PR)
✔ App Actions limited to setup/state not primary UI validation.
✔ No hidden assertions inside helpers.
✔ Intercepts declared in spec and awaited explicitly.
✔ Helpers < 15–20 lines, no conditionals, pure.
✔ At least one negative scenario present.
✔ Data via fixtures or API—no manual multi-step UI for setup.

Adopt this hybrid model to keep tests FAST (App Actions) and CLEAR (minimal focused helpers) without drifting into brittle large Page Object patterns.

---

## 📋 Core Principles

### 1. Independent and Isolated Tests
```javascript
// ✅ GOOD - Independent test
describe('User Profile', () => {
  beforeEach(() => {
    cy.loginAsUser('testuser@email.com')
    cy.visit('/profile')
  })

  it('should update profile information', () => {
    // isolated test with its own context
  })
})

// ❌ BAD - Dependent test
it('should login', () => {
  cy.login()
})

it('should update profile', () => {
  cy.visit('/profile') // depends on previous test
})
```

### 2. App Actions Pattern
Interact directly with the application via JavaScript instead of always using UI.

```javascript
// ✅ GOOD - App Action (faster and more reliable)
Cypress.Commands.add('loginByAPI', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token)
  })
})

// ✅ GOOD - Bypass UI when not the focus
Cypress.Commands.add('createProduct', (product) => {
  return cy.request('POST', '/api/products', product)
})

// ❌ BAD - UI for setup when unnecessary
beforeEach(() => {
  cy.visit('/login')
  cy.get('#email').type('user@test.com')
  cy.get('#password').type('password')
  cy.get('button[type="submit"]').click()
  cy.wait(2000) // anti-pattern
})
```

### 3. Custom Commands - Reusability
Create custom commands for repetitive actions and encapsulate complex logic.

```javascript
// cypress/support/commands.js

// ✅ Authentication commands
Cypress.Commands.add('loginAsAdmin', () => {
  cy.loginByAPI(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'))
})

Cypress.Commands.add('loginAsUser', (email) => {
  const password = Cypress.env('USER_PASSWORD')
  cy.loginByAPI(email, password)
})

// ✅ Data operations command
Cypress.Commands.add('seedDatabase', (fixtures) => {
  cy.task('db:seed', fixtures)
})

// ✅ Complex assertion command
Cypress.Commands.add('shouldBeVisible', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should('be.visible').and('not.be.disabled')
})

// ✅ Common navigation command
Cypress.Commands.add('navigateToSection', (section) => {
  cy.get(`[data-cy="nav-${section}"]`).click()
  cy.url().should('include', `/${section}`)
})
```

### 4. Data-* Attributes - Resilient Selectors
**ALWAYS** use `data-cy`, `data-test`, or `data-testid` attributes for selectors.

```javascript
// ✅ EXCELLENT - data-cy attribute
cy.get('[data-cy="submit-button"]').click()
cy.get('[data-cy="user-name-input"]').type('John')
cy.get('[data-cy="product-card"]').should('have.length', 5)

// ✅ GOOD - data-test or data-testid
cy.get('[data-test="login-form"]')
cy.get('[data-testid="error-message"]')

// ⚠️ AVOID - CSS classes (can change)
cy.get('.btn-primary') // fragile

// ❌ BAD - Generic IDs or HTML structure
cy.get('#button-1') // not semantic
cy.get('div > button:nth-child(2)') // very fragile
```

### 5. Fixtures - Synthetic Data
Use fixtures for consistent and maintainable test data.

```javascript
// cypress/fixtures/users.json
{
  "validUser": {
    "email": "valid.user@test.com",
    "password": "Test@1234",
    "name": "Valid User"
  },
  "adminUser": {
    "email": "admin@test.com",
    "password": "Admin@1234",
    "role": "admin"
  },
  "invalidUsers": [
    {
      "email": "invalid@test.com",
      "password": "wrong",
      "expectedError": "Invalid credentials"
    }
  ]
}

// Usage in tests
describe('User Registration', () => {
  beforeEach(() => {
    cy.fixture('users').as('usersData')
  })

  it('should register a valid user', function() {
    const user = this.usersData.validUser
    cy.visit('/register')
    cy.get('[data-cy="email-input"]').type(user.email)
    cy.get('[data-cy="password-input"]').type(user.password)
    cy.get('[data-cy="name-input"]').type(user.name)
    cy.get('[data-cy="submit-button"]').click()
    cy.url().should('include', '/dashboard')
  })
})
```

### 6. Intercepts - Request Control
Use `cy.intercept()` to mock, wait, and validate API calls.

```javascript
// ✅ API Mock
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers')
cy.visit('/users')
cy.wait('@getUsers')
cy.get('[data-cy="user-item"]').should('have.length', 3)

// ✅ Simulate errors
cy.intercept('POST', '/api/login', {
  statusCode: 401,
  body: { error: 'Invalid credentials' }
}).as('loginError')
cy.get('[data-cy="submit-button"]').click()
cy.wait('@loginError')
cy.get('[data-cy="error-message"]').should('contain', 'Invalid credentials')

// ✅ Validate payloads
cy.intercept('POST', '/api/products').as('createProduct')
cy.get('[data-cy="save-button"]').click()
cy.wait('@createProduct').its('request.body').should('deep.include', {
  name: 'New Product',
  price: 99.99
})

// ✅ Simulate latency
cy.intercept('GET', '/api/data', (req) => {
  req.reply((res) => {
    res.delay(2000)
    res.send({ fixture: 'data.json' })
  })
})
```

### 7. Smart Waits
**NEVER** use `cy.wait(number)`. Always wait for elements or requests.

```javascript
// ✅ GOOD - Wait for element
cy.get('[data-cy="loading"]').should('not.exist')
cy.get('[data-cy="content"]').should('be.visible')

// ✅ GOOD - Wait for request
cy.intercept('GET', '/api/data').as('getData')
cy.visit('/dashboard')
cy.wait('@getData')

// ✅ GOOD - Assertions with automatic retry
cy.get('[data-cy="result"]').should('have.text', 'Success')

// ❌ BAD - Arbitrary wait
cy.wait(3000) // NEVER do this

// ✅ GOOD - Custom timeouts when needed
cy.get('[data-cy="slow-component"]', { timeout: 10000 }).should('be.visible')
```

### 8. Page Object Model (Simplified)
Use objects or classes to encapsulate pages and components.

```javascript
// cypress/support/pages/loginPage.js
export class LoginPage {
  elements = {
    emailInput: () => cy.get('[data-cy="email-input"]'),
    passwordInput: () => cy.get('[data-cy="password-input"]'),
    submitButton: () => cy.get('[data-cy="submit-button"]'),
    errorMessage: () => cy.get('[data-cy="error-message"]')
  }

  visit() {
    cy.visit('/login')
  }

  fillEmail(email) {
    this.elements.emailInput().clear().type(email)
    return this
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password)
    return this
  }

  submit() {
    this.elements.submitButton().click()
    return this
  }

  login(email, password) {
    this.fillEmail(email)
    this.fillPassword(password)
    this.submit()
  }

  shouldShowError(message) {
    this.elements.errorMessage().should('contain', message)
  }
}

// Usage in test
import { LoginPage } from '../support/pages/loginPage'

describe('Login Flow', () => {
  const loginPage = new LoginPage()

  beforeEach(() => {
    loginPage.visit()
  })

  it('should login successfully', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validUser.email, users.validUser.password)
      cy.url().should('include', '/dashboard')
    })
  })
})
```

### 9. Test Organization
Clear and descriptive structure using `describe` and `context`.

```javascript
describe('User Management', () => {
  context('When user is admin', () => {
    beforeEach(() => {
      cy.loginAsAdmin()
      cy.visit('/users')
    })

    it('should display all users', () => {
      cy.get('[data-cy="user-item"]').should('have.length.at.least', 1)
    })

    it('should be able to delete users', () => {
      cy.get('[data-cy="delete-button"]').first().click()
      cy.get('[data-cy="confirm-modal"]').should('be.visible')
    })
  })

  context('When user is regular', () => {
    beforeEach(() => {
      cy.loginAsUser('regular@test.com')
      cy.visit('/users')
    })

    it('should not see delete button', () => {
      cy.get('[data-cy="delete-button"]').should('not.exist')
    })
  })
})
```

### 10. Robust Assertions
Use multiple chained assertions when necessary.

```javascript
// ✅ GOOD - Chained assertions
cy.get('[data-cy="product-card"]')
  .should('be.visible')
  .and('contain', 'Laptop')
  .and('have.class', 'available')
  .find('[data-cy="price"]')
  .should('have.text', '$1,299.99')

// ✅ GOOD - URL assertions
cy.url()
  .should('include', '/products')
  .and('match', /\/products\/\d+/)

// ✅ GOOD - Array assertions
cy.get('[data-cy="item"]')
  .should('have.length', 5)
  .first()
  .should('contain', 'Item 1')

// ✅ GOOD - Custom assertions
cy.get('[data-cy="date"]').should(($el) => {
  const text = $el.text()
  expect(text).to.match(/\d{2}\/\d{2}\/\d{4}/)
})
```

---

## 🏗️ Recommended Project Structure

```
cypress/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.cy.js
│   │   └── registration.spec.cy.js
│   ├── products/
│   │   ├── product-list.spec.cy.js
│   │   └── product-details.spec.cy.js
│   └── user/
│       └── profile.spec.cy.js
├── fixtures/
│   ├── users.json
│   ├── products.json
│   └── common.json
├── support/
│   ├── commands.js          # Global custom commands
│   ├── e2e.js               # Global configurations
│   ├── pages/               # Page Objects
│   │   ├── loginPage.js
│   │   └── productPage.js
│   └── utils/               # Helper functions
│       ├── dataGenerator.js
│       └── apiHelpers.js
```

---

## 🎨 Naming Conventions

### Test Files
```javascript
// Descriptive name of what is being tested
login.spec.cy.js
user-profile.spec.cy.js
checkout-flow.spec.cy.js
```

### Describes and Its
```javascript
// ✅ GOOD - Descriptive and clear
describe('Shopping Cart', () => {
  it('should add product to cart', () => {})
  it('should remove product from cart', () => {})
  it('should calculate total price correctly', () => {})
})

// ✅ GOOD - Using context for scenarios
describe('Product Search', () => {
  context('with valid query', () => {
    it('should display matching products', () => {})
  })
  
  context('with no results', () => {
    it('should display empty state message', () => {})
  })
})
```

### Data Attributes
```javascript
// Pattern: data-cy="component-action-context"
[data-cy="login-button-submit"]
[data-cy="product-card-image"]
[data-cy="cart-item-remove"]
[data-cy="user-profile-edit"]
```

---

## 🚀 Performance and Optimization

### 1. Reuse State Between Tests (when appropriate)
```javascript
// For cases where performance is critical
describe('Dashboard Tests', () => {
  before(() => {
    // Setup once for entire suite
    cy.loginAsAdmin()
  })

  beforeEach(() => {
    // Preserve cookies between tests
    Cypress.Cookies.preserveOnce('sessionId', 'authToken')
    cy.visit('/dashboard')
  })

  // Multiple tests sharing the session
})
```

### 2. Parallelization and Tagging
```javascript
// Use tags to run specific groups
describe('User Management', { tags: ['@smoke', '@user'] }, () => {
  it('should create user', { tags: '@critical' }, () => {})
})

// Run: npx cypress run --env grepTags=@smoke
```

---

## 🔍 Debugging and Troubleshooting

```javascript
// ✅ Debug with .then()
cy.get('[data-cy="element"]').then(($el) => {
  console.log('Element:', $el)
  debugger // To pause in DevTools
})

// ✅ Debug with cy.pause()
cy.get('[data-cy="button"]').click()
cy.pause() // Pause execution
cy.get('[data-cy="result"]').should('be.visible')

// ✅ Custom log
cy.log('Starting checkout process')
cy.get('[data-cy="checkout-button"]').click()

// ✅ Screenshots on failures (automatic)
// Custom screenshots
cy.screenshot('before-submit')
```

---

## ✅ Checklist for Creating New Tests

When receiving a test scenario, follow this checklist:

1. **Identify dependencies**
   - [ ] Requires authentication?
   - [ ] Needs specific data?
   - [ ] Depends on application state?

2. **Prepare data**
   - [ ] Create/update necessary fixtures
   - [ ] Configure API mocks if needed

3. **Create custom commands** (if applicable)
   - [ ] Is there repetitive logic that can be encapsulated?
   - [ ] Need new app actions?

4. **Structure the test**
   - [ ] Use appropriate describe/context
   - [ ] Configure beforeEach for setup
   - [ ] Ensure test independence

5. **Implement the test**
   - [ ] Use data-cy attributes
   - [ ] Avoid fixed waits
   - [ ] Use intercepts when necessary
   - [ ] Clear and multiple assertions

6. **Validate**
   - [ ] Test passes consistently
   - [ ] Can run in isolation
   - [ ] Error messages are clear

---

## 🎯 Common Scenario Examples

### Form Test (Hybrid Pattern)
```javascript
// ✅ Form validation IS under test - keep UI explicit
describe('Contact Form', { tags: ['@regression'] }, () => {
  beforeEach(() => {
    // Simple navigation - no app action needed
    cy.visit('/contact')
    cy.get('[data-cy="contact-form"]').should('be.visible')
  })

  it('should submit form with valid data', () => {
    cy.fixture('forms').then((data) => {
      const contact = data.validContact
      
      // Form interaction - explicit (under test)
      cy.get('[data-cy="name-input"]').type(contact.name)
      cy.get('[data-cy="email-input"]').type(contact.email)
      cy.get('[data-cy="message-textarea"]').type(contact.message)
      
      // Intercept explicit in spec
      cy.intercept('POST', '/api/contact', {
        statusCode: 200,
        body: { id: 'MSG-001', status: 'sent' }
      }).as('submitForm')
      
      cy.get('[data-cy="submit-button"]').click()
      
      // Explicit validation
      cy.wait('@submitForm').then((interception) => {
        expect(interception.request.body).to.include({
          name: contact.name,
          email: contact.email
        })
      })
      cy.get('[data-cy="success-message"]').should('be.visible')
        .and('contain', 'Message sent successfully')
      cy.get('[data-cy="contact-form"]').should('not.exist')
    })
  })

  it('should show validation errors for empty required fields', () => {
    // Direct validation test - no setup needed
    cy.get('[data-cy="submit-button"]').click()
    
    cy.get('[data-cy="name-error"]').should('be.visible')
      .and('contain', 'Name is required')
    cy.get('[data-cy="email-error"]').should('be.visible')
      .and('contain', 'Email is required')
    cy.get('[data-cy="message-error"]').should('be.visible')
  })
  
  it('should validate email format', { tags: '@negative' }, () => {
    cy.get('[data-cy="name-input"]').type('John Doe')
    cy.get('[data-cy="email-input"]').type('invalid-email')
    cy.get('[data-cy="message-textarea"]').type('Test message')
    cy.get('[data-cy="submit-button"]').click()
    
    cy.get('[data-cy="email-error"]').should('be.visible')
      .and('contain', 'Invalid email format')
  })
})

// ✅ When form is setup for another test (use App Action)
describe('Contact History', () => {
  beforeEach(() => {
    cy.loginByAPI(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'))
    // Seed contacts via API - not UI
    cy.seedContacts([
      { id: 'C1', name: 'John', email: 'john@test.com', message: 'Hello', status: 'sent' },
      { id: 'C2', name: 'Jane', email: 'jane@test.com', message: 'Hi', status: 'pending' }
    ])
  })
  
  it('should display contact history for admin', () => {
    cy.visit('/admin/contacts')
    cy.get('[data-cy="contact-item"]').should('have.length', 2)
    cy.get('[data-cy="contact-item"]').first().should('contain', 'John')
  })
})
```

### Complete E2E Test (Hybrid Pattern)
```javascript
// ✅ BEST PRACTICE: App Actions for setup, UI assertions explicit, minimal helpers
describe('E2E: Purchase Flow', () => {
  beforeEach(() => {
    cy.fixture('users').as('users')
  })

  it('should complete purchase from search to confirmation', function() {
    // 1. Setup via App Actions (fast, reliable)
    cy.loginByAPI(this.users.validUser.email, Cypress.env('USER_PASSWORD'))
    cy.seedProducts([{ id: 'P1', name: 'Laptop Pro', price: 1299, category: 'electronics' }])
    
    // 2. Visit and validate initial state
    cy.visit('/')
    cy.get('[data-cy="search-input"]').should('be.visible')
    
    // 3. Add product via App Action (not under test)
    cy.addToCartByAPI('P1', 1)
    cy.visit('/cart')
    cy.get('[data-cy="cart-count"]').should('have.text', '1')
    cy.get('[data-cy="product-name"]').should('contain', 'Laptop Pro')
    
    // 4. Checkout - UI validation (this IS under test)
    cy.get('[data-cy="checkout-button"]').click()
    cy.url().should('include', '/checkout')
    
    // 5. Payment via App Action (not UI focus)
    cy.fillPaymentInfoByAPI(this.users.validUser.paymentMethod)
    
    // 6. Order creation with intercept
    cy.intercept('POST', '/api/orders', {
      statusCode: 201,
      body: { orderId: 'ORD-12345', total: 1299 }
    }).as('createOrder')
    
    cy.get('[data-cy="confirm-purchase"]').click()
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201)
    
    // 7. Explicit UI validation (critical path)
    cy.url().should('include', '/order-confirmation')
    cy.get('[data-cy="order-number"]').should('contain', 'ORD-12345')
    cy.get('[data-cy="order-total"]').should('contain', '$1,299')
    cy.get('[data-cy="success-message"]').should('be.visible')
  })
})

// ✅ Alternative: When UI search/filtering IS the feature under test
describe('E2E: Search and Purchase', { tags: ['@smoke'] }, () => {
  beforeEach(() => {
    cy.loginByAPI(Cypress.env('DEFAULT_USER_EMAIL'), Cypress.env('USER_PASSWORD'))
    cy.seedProducts([
      { id: 'P1', name: 'Laptop Pro', category: 'electronics' },
      { id: 'P2', name: 'Mouse USB', category: 'electronics' },
      { id: 'P3', name: 'Novel Book', category: 'books' }
    ])
    cy.visit('/')
  })

  it('should search, filter, and purchase product', () => {
    // Search UI - this IS under test
    cy.intercept('GET', '/api/products/search?q=laptop*').as('search')
    cy.get('[data-cy="search-input"]').type('laptop')
    cy.get('[data-cy="search-button"]').click()
    cy.wait('@search')
    
    // Validate search results
    cy.get('[data-cy="product-card"]').should('have.length', 1)
    cy.get('[data-cy="product-card"]').first().should('contain', 'Laptop Pro')
    
    // Add to cart - UI validation
    cy.get('[data-cy="product-card"]').first().click()
    cy.url().should('include', '/product/P1')
    cy.get('[data-cy="add-to-cart"]').click()
    cy.get('[data-cy="cart-count"]').should('have.text', '1')
    
    // Checkout flow via App Action (already tested elsewhere)
    cy.checkoutByAPI('P1', this.users.validUser.paymentMethod)
    
    // Final validation
    cy.visit('/orders')
    cy.get('[data-cy="order-item"]').first().should('contain', 'Laptop Pro')
  })
})
```

---

## 📚 Resources and References

- **Official Documentation**: https://docs.cypress.io
- **Best Practices**: https://docs.cypress.io/guides/references/best-practices
- **Real World App**: https://github.com/cypress-io/cypress-realworld-app
- **Cypress Blog**: https://www.cypress.io/blog

---

## 🎓 Code Generation Guidelines

When receiving a prompt with a test scenario:

1. **Analyze** the scenario and identify:
   - Page/functionality to test
   - Required data
   - Test flow

2. **Reuse** existing code:
   - Check if custom commands already exist
   - Use existing fixtures when possible
   - Follow patterns already established in the project

3. **Create complete structure**:
   - Fixture (if needed)
   - Custom commands (if repetitive)
   - Test file with describe/it
   - Appropriate intercepts

4. **Ensure quality**:
   - Independent tests
   - Data-cy attributes
   - Robust assertions
   - Clean and commented code

---

## 🧠 Prompt Intake & Transformation (QA / Product / Business)

When receiving a natural language prompt (user story, acceptance criteria, step-by-step, bug report), apply this structured workflow before generating tests.

### 1. Classify Prompt Type
- User Story (e.g., "As a user I want...")
- Acceptance Criteria list (Given/When/Then or bullet points)
- Step-by-Step scenario (numbered steps)
- Bug Reproduction scenario
- Regulatory / Non-functional (performance, accessibility)

### 2. Extraction Checklist
Parse and extract:
- Primary feature / page path (`/login`, `/checkout`, etc.)
- Preconditions (authentication state, seeded data, feature flags)
- Actors / roles (admin, anonymous, customer)
- Data variants (valid, invalid, boundary, empty, duplicate)
- API interactions to intercept (list endpoints implied)
- Expected UI outcomes (messages, redirects, counts, visual states)
- Side effects (DB changes, email trigger, token update)

### 3. Map Acceptance Criteria → Assertions
Use a structured matrix:
| Criterion Type | Typical Assertion | Example |
| -------------- | ----------------- | ------- |
| Redirect       | `cy.url().should('include', '/dashboard')` | After login |
| Visibility     | `cy.get('[data-cy="x"]').should('be.visible')` | Success banner |
| Absence        | `cy.get('[data-cy="error"]').should('not.exist')` | No error after save |
| Text Match     | `.should('contain', 'Updated successfully')` | Toast message |
| Count          | `.should('have.length', n)` | List items |
| Attribute      | `.should('have.attr', 'aria-disabled', 'true')` | Accessibility state |
| State Change   | Intercept + request/response validation | Order created |

### 4. Derive Test Cases Set
Minimum recommended for a single functional story:
- Happy Path (primary success)
- Validation failures (each required field)
- Authorization / role restriction (if roles mentioned)
- Boundary data (min/max lengths, zero results)
- Negative path (invalid credentials, server error simulation via intercept 4xx/5xx)

### 5. Decide Setup Strategy
- Use App Actions (API calls) for preconditions (create user/product/order)
- Seed fixtures for deterministic data
- Intercepts for: success, error, empty state, latency
- Environment variables for secrets (`CYPRESS_` or `Cypress.env()`)

### 6. Tagging & Prioritization
Apply tags metadata in `describe` or `it` options:
- `@smoke` critical path
- `@regression` broader coverage
- `@critical` business critical
- `@accessibility`, `@negative`, `@boundary` where relevant

### 7. Naming Conventions From Prompts
Transform phrase: `User can reset password with valid token` → file `password-reset.spec.cy.js`, test name `should reset password with valid token`.

### 8. Scenario Templates
User Story Template:
```javascript
// Story: As <role> I want <goal> so that <value>
// AC: <list>
describe('Feature: <short-feature-name>', { tags: ['@smoke'] }, () => {
  beforeEach(() => {
    // Preconditions (login, seed, visit)
  })

  context('Happy Path', () => {
    it('should <expected-outcome>', () => {
      // Steps derived from Given/When
      // Assertions from Then
    })
  })

  context('Validation', () => {
    it('should show error when <missing-condition>', () => {})
  })
})
```

Step-by-Step Template:
```javascript
// Steps provided by prompt numbered 1..N
describe('Flow: <name>', () => {
  it('completes <flow summary>', () => {
    // 1. <step>
    // 2. <step>
    // 3. Assertions
  })
})
```

Bug Reproduction Template:
```javascript
// Bug Report ID: BR-123
// Expected: <correct behavior>
// Current: <faulty behavior>
describe('BugFix: BR-123 <short-title>', { tags: ['@regression'] }, () => {
  it('should display correct behavior (fix regression)', () => {
    // Reproduce steps
    // Assertion for fixed outcome
  })
})
```

### 9. Example Transformation
Prompt (User Story):
"As a registered user I want to filter products by category so I can find relevant items quickly.
Acceptance Criteria:
1. Given I am on products page when I select a category then only products of that category are listed.
2. Given no products in category then an empty state message is shown.
3. Given API error then an error banner appears.
4. Filtering updates URL with query parameter."

Generated Test:
```javascript
describe('Products Filtering', { tags: ['@smoke', '@regression'] }, () => {
  beforeEach(() => {
    cy.loginAsUser(Cypress.env('DEFAULT_USER_EMAIL'))
    cy.visit('/products')
  })

  context('Happy Path', () => {
    it('should list only items of selected category', () => {
      cy.intercept('GET', '/api/products?category=electronics', { fixture: 'products/electronics.json' }).as('getElectronics')
      cy.get('[data-cy="filter-category-electronics"]').click()
      cy.wait('@getElectronics').its('response.statusCode').should('eq', 200)
      cy.get('[data-cy="product-card"]').each(card => {
        cy.wrap(card).find('[data-cy="product-category"]').should('contain', 'electronics')
      })
      cy.url().should('include', 'category=electronics')
    })
  })

  context('Empty State', () => {
    it('should show empty message when no products found', () => {
      cy.intercept('GET', '/api/products?category=books', { fixture: 'products/empty.json' }).as('getBooks')
      cy.get('[data-cy="filter-category-books"]').click()
      cy.wait('@getBooks')
      cy.get('[data-cy="empty-state"]').should('be.visible').and('contain', 'No products available')
      cy.get('[data-cy="product-card"]').should('have.length', 0)
    })
  })

  context('API Error', () => {
    it('should show error banner on server failure', () => {
      cy.intercept('GET', '/api/products?category=fashion', { statusCode: 500, body: { error: 'Internal error' } }).as('getFashionFail')
      cy.get('[data-cy="filter-category-fashion"]').click()
      cy.wait('@getFashionFail')
      cy.get('[data-cy="error-banner"]').should('be.visible').and('contain', 'Internal error')
    })
  })
})
```

### 10. Negative & Edge Coverage Guidelines
- Always include at least one server error (5xx) and one client error (4xx) scenario when APIs are central
- Test empty lists, max length strings, invalid formats, and unauthorized role access
- Use fixture variants: `entity-valid.json`, `entity-empty.json`, `entity-error.json`

### 11. Prioritization Heuristics
If prompt is large, start with:
1. Critical path (user can complete goal)
2. Failure handling (visible feedback)
3. Data boundary (min/max)
4. Performance risk (optional tag @latency using intercept delays)

### 12. Output Formatting Rules for Copilot Suggestions
Generated code MUST:
- Include `describe` block named after feature or flow
- Group related scenarios using `context`
- Use `data-cy` selectors only
- Avoid naked waits; rely on intercepts & element assertions
- Place intercepts before triggering action that fires request
- Keep fixture file paths consistent (`fixtures/<domain>/<variant>.json`)

### 13. Quick Sanity Checklist Before Emitting Code
`login` done via API? ✔
`data-cy` selectors only? ✔
No `cy.wait(<number>)`? ✔
Intercepts have aliases & are waited? ✔
Assertions cover all acceptance criteria? ✔
Edge/negative at least one? ✔
URL/state side effects asserted? ✔

---

## 🚨 Final Reminders

- **Tests must be reliable, fast, and maintainable**
- **Prioritize quality over quantity**
- **Always follow governance rules**
- **Make tests that developers trust and want to run**

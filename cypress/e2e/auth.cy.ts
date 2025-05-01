describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Login Flow', () => {
    it('should successfully log in with valid credentials', () => {
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('StrongPassword123!');
      cy.get('[data-testid="login-submit"]').click();

      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('should show error message with invalid credentials', () => {
      cy.get('[data-testid="login-email"]').type('wrong@example.com');
      cy.get('[data-testid="login-password"]').type('WrongPassword123!');
      cy.get('[data-testid="login-submit"]').click();

      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', '이메일 또는 비밀번호가 올바르지 않습니다');
    });

    it('should lock account after multiple failed attempts', () => {
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="login-email"]').type('test@example.com');
        cy.get('[data-testid="login-password"]').type('WrongPassword123!');
        cy.get('[data-testid="login-submit"]').click();
        cy.get('[data-testid="login-email"]').clear();
        cy.get('[data-testid="login-password"]').clear();
      }

      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', '계정이 잠겼습니다');
    });
  });

  describe('Registration Flow', () => {
    it('should successfully register a new user', () => {
      cy.get('[data-testid="register-link"]').click();
      
      cy.get('[data-testid="register-name"]').type('New User');
      cy.get('[data-testid="register-email"]').type('newuser@example.com');
      cy.get('[data-testid="register-password"]').type('StrongPassword123!');
      cy.get('[data-testid="register-confirm-password"]').type('StrongPassword123!');
      cy.get('[data-testid="register-submit"]').click();

      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('should show error for existing email', () => {
      cy.get('[data-testid="register-link"]').click();
      
      cy.get('[data-testid="register-name"]').type('Existing User');
      cy.get('[data-testid="register-email"]').type('test@example.com');
      cy.get('[data-testid="register-password"]').type('StrongPassword123!');
      cy.get('[data-testid="register-confirm-password"]').type('StrongPassword123!');
      cy.get('[data-testid="register-submit"]').click();

      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', '이미 사용 중인 이메일입니다');
    });

    it('should validate password strength', () => {
      cy.get('[data-testid="register-link"]').click();
      
      cy.get('[data-testid="register-password"]').type('weak');
      cy.get('[data-testid="register-confirm-password"]').type('weak');
      
      cy.get('[data-testid="password-strength"]')
        .should('be.visible')
        .and('contain', '비밀번호는 최소 12자 이상이며');
    });
  });

  describe('Language Switching', () => {
    it('should switch between Korean and English', () => {
      // Check Korean text
      cy.get('[data-testid="login-title"]').should('contain', '로그인');
      cy.get('[data-testid="login-email-label"]').should('contain', '이메일');
      cy.get('[data-testid="login-password-label"]').should('contain', '비밀번호');

      // Switch to English
      cy.get('[data-testid="language-switcher"]').click();
      cy.get('[data-testid="language-en"]').click();

      // Check English text
      cy.get('[data-testid="login-title"]').should('contain', 'Login');
      cy.get('[data-testid="login-email-label"]').should('contain', 'Email');
      cy.get('[data-testid="login-password-label"]').should('contain', 'Password');
    });
  });

  describe('Session Management', () => {
    it('should maintain session after page refresh', () => {
      // Login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('StrongPassword123!');
      cy.get('[data-testid="login-submit"]').click();

      // Refresh page
      cy.reload();

      // Check if still logged in
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('should log out and clear session', () => {
      // Login
      cy.get('[data-testid="login-email"]').type('test@example.com');
      cy.get('[data-testid="login-password"]').type('StrongPassword123!');
      cy.get('[data-testid="login-submit"]').click();

      // Logout
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();

      // Check if redirected to login
      cy.url().should('include', '/login');
      cy.get('[data-testid="login-title"]').should('be.visible');
    });
  });
}); 
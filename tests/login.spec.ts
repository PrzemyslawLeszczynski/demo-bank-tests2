import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('User login to Demobank', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    loginPage = new LoginPage(page);
  });
  test(
    'successful login with correct credentials',
    {
      tag: ['@login', '@smoke'],
      annotation: [
        {
          type: 'Happy path',
          description: 'Basic happy path for login',
        },
        { type: 'documentation', description: 'https://playwright.info/' },
      ],
    },
    async ({ page }) => {
      //Arrange

      const userID = loginData.userID;
      const userPassword = loginData.userPassword;
      const expectedUserName = 'Jan Demobankowy';

      //Act
      await loginPage.login(userID, userPassword);

      //Assert
      const pulpitPage = new PulpitPage(page);
      await expect(pulpitPage.userNameText).toHaveText(expectedUserName);
    },
  );

  test(
    'unsuccessful login with too shart username',
    { tag: ['@login', '@unhappy_path'] }, 
    async ({ page }) => {
      //Arrange
      const incorrectUserID = 'tester';
      const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

      //Act
      await loginPage.loginInput.fill(incorrectUserID);
      await loginPage.passwordInput.click();

      //Assert
      await expect(loginPage.loginError).toHaveText(expectedErrorMessage);
    },
  );

  test(
    'unsuccessful login with too short password',
    { tag: ['@login', '@unhappy_path'] },
    async ({ page }) => {
      //Arrange
      const userID = loginData.userID;
      const incorrectUserPassword = '1234567';
      const expectedErrorMessage = 'hasło ma min. 8 znaków';

      //Act
      await loginPage.loginInput.fill(userID);
      await loginPage.passwordInput.fill(incorrectUserPassword);
      await loginPage.passwordInput.blur();

      //Assert
      await expect(loginPage.passwordError).toHaveText(expectedErrorMessage);
    },
  );
});

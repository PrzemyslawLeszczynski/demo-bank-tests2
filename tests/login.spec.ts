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
  test('successful login with correct credentials', async ({ page }) => {
    //Arrange

    const userID = loginData.userID;
    const userPassword = loginData.userPassword;
    const expectedUserName = 'Jan Demobankowy';

    //Act
    await loginPage.login(userID, userPassword);

    //Assert
    const pulpitPage = new PulpitPage(page);
    await expect(pulpitPage.userNameText).toHaveText(expectedUserName);
  });

  test('unsuccessful login with too shart username', async ({ page }) => {
    //Arrange
    const incorrectUserID = 'tester';
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

    //Act
    await loginPage.loginInput.fill(incorrectUserID);
    await loginPage.passwordInput.click();

    //Assert
    await expect(loginPage.loginError).toHaveText(expectedErrorMessage);
  });

  test('unsuccessful login with too short password', async ({ page }) => {
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
  });
});

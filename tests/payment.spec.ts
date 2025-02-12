import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PaymentPage } from '../pages/payment.page';

test.describe('Payment tests', () => {
  test.beforeEach(async ({ page }) => {
    const userID = loginData.userID;
    const userPassword = loginData.userPassword;

    await page.goto('/');
    const loginPage = new LoginPage(page);

    await loginPage.loginInput.fill(userID);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();

    await page.getByRole('link', { name: 'płatności' }).click();
  });

  test('simple payment', async ({ page, request }) => {
    // Arrange
    const transferReceiver = 'leshchu';
    const transferAccount = '11 1111 1111 1111 1111 1111 1111';
    const transferAmount = '666';
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;

    // Act
    const paymentPage = new PaymentPage(page);
    await paymentPage.transferReceiverInput.fill(transferReceiver);
    await paymentPage.transferToInput.fill(transferAccount);
    await paymentPage.transferAmountInput.fill(transferAmount);
    await paymentPage.transferButton.click();
    await paymentPage.actionCloseButton.click();

    // Assert
    await expect(paymentPage.expectedMessage).toHaveText(
      expectedMessage,
    );
  });
});

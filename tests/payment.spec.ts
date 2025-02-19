import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';
import { PaymentPage } from '../pages/payment.page';
import { log } from 'console';

test.describe('Payment tests', () => {
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    const userID = loginData.userID;
    const userPassword = loginData.userPassword;

    await page.goto('/');
    const loginPage = new LoginPage(page);

    await loginPage.login(userID, userPassword);

    const pulpitPage = new PulpitPage(page);
    await pulpitPage.sideMenuComponent.paymentButton.click();

    paymentPage = new PaymentPage(page);
  });

  test(
    'simple payment @payment @integration',
    {
      tag: ['@payment', '@integration'],
      annotation: {
        type: 'documentation',
        description: 'More to find at http://jaktestowac.pl/lesson/pw1s04l04/',
      },
    },

    async ({ page, request }) => {
      // Arrange
      const transferReceiver = 'leshchu';
      const transferAccount = '11 1111 1111 1111 1111 1111 1111';
      const transferAmount = '666';
      const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;

      // Act
      await paymentPage.makeTransfer(
        transferReceiver,
        transferAccount,
        transferAmount,
      );

      await page.waitForLoadState('domcontentloaded');

      // Assert
      await expect(paymentPage.expectedMessage).toHaveText(expectedMessage);
    },
  );
});

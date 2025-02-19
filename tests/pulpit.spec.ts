import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Pulpit tests', () => {
  let pulpitPage: PulpitPage;

  test.beforeEach(async ({ page }) => {
    const userID = loginData.userID;
    const userPassword = loginData.userPassword;

    await page.goto('/');
    const loginPage = new LoginPage(page);

    await loginPage.login(userID, userPassword);

    pulpitPage = new PulpitPage(page);
  });

  test(
    'quick payment with correct data',
    {
      tag: ['@pulpit', '@integration'],
      annotation: {
        type: 'documentation',
        description: 'https://jaktestowac.pl/course/playwright-wprowadzenie/',
      },
    },
    async ({ page }) => {
      //Arrange
      const receiverId = '2';
      const transferAmount = '666';
      const transferTitle = 'pizza';
      const expectedTransferReceiver = 'Chuck Demobankowy';
      const expectedMessage = `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`;

      //Act
      await pulpitPage.executeQuickPayment(
        receiverId,
        transferAmount,
        transferTitle,
      );

      //Assert
      await expect(pulpitPage.expectedTransferMessage).toHaveText(
        expectedMessage,
      );
    },
  );

  test(
    'successful mobile top-up',
    { tag: ['@pulpit', '@integration'] },
    async ({ page }) => {
      //Arrange
      const topUpReceiver = '500 xxx xxx';
      const topUpAmount = '666';
      const expectedMessage = `Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReceiver}`;

      //Act
      await pulpitPage.executeMobileTopUp(topUpReceiver, topUpAmount);

      //Assert
      await expect(pulpitPage.expectedTopUpMessage).toHaveText(expectedMessage);
    },
  );

  test(
    'correct balance after successful mobile top-up',
    { tag: ['@pulpit', '@integration'] },
    async ({ page }) => {
      //Arrange
      const pulpitPage = new PulpitPage(page);
      const topUpReceiver = '500 xxx xxx';
      const topUpAmount = '50';
      const initialBalance = await pulpitPage.moneyValueText.innerText();
      const expectedBalance = Number(initialBalance) - Number(topUpAmount);

      //Act

      await pulpitPage.executeMobileTopUp(topUpReceiver, topUpAmount);

      //Assert
      await expect(pulpitPage.moneyValueText).toHaveText(`${expectedBalance}`);
    },
  );
});

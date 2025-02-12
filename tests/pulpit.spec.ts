import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Pulpit tests', () => {
  test.beforeEach(async ({ page }) => {
    const userID = loginData.userID;
    const userPassword = loginData.userPassword;

    await page.goto('/');
    const loginPage = new LoginPage(page);

    await loginPage.loginInput.fill(userID);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();
  });

  test('quick payment with correct data', async ({ page }) => {
    //Arrange
    const receiverId = '2';
    const transferAmount = '666';
    const transferTitle = 'pizza';
    const expectedTransferReceiver = 'Chuck Demobankowy';
    const expectedMessage = `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`;

    //Act
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.receiverIdInput.selectOption(receiverId);
    await pulpitPage.transferAmountInput.fill(transferAmount);
    await pulpitPage.transferTitleInput.fill(transferTitle);

    await pulpitPage.transferButton.click();
    await pulpitPage.closeButton.click();

    //Assert
    await expect(pulpitPage.expectedTransferMessage).toHaveText(
      expectedMessage,
    );
  });

  test('successful mobile top-up', async ({ page }) => {
    //Arrange
    const topUpReceiver = '500 xxx xxx';
    const topUpAmount = '666';
    const expectedMessage = `Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReceiver}`;

    //Act
    const pulpitPage = new PulpitPage(page);

    await pulpitPage.topUpReceiverInput.selectOption(topUpReceiver);
    await pulpitPage.topUpAmountInput.fill(topUpAmount);
    await pulpitPage.topUpAgreementCheckBox.click();
    await pulpitPage.topUpExecuteButton.click();
    await pulpitPage.closeButton.click();

    await page.waitForLoadState('domcontentloaded');

    //Assert
    await expect(pulpitPage.expectedTopUpMessage).toHaveText(expectedMessage);
  });

  test('correct balance after successful mobile top-up', async ({ page }) => {
    //Arrange
    const pulpitPage = new PulpitPage(page);
    const topUpReceiver = '500 xxx xxx';
    const topUpAmount = '50';
    const initialBalance = await pulpitPage.moneyValueText.innerText();
    const expectedBalance = Number(initialBalance) - Number(topUpAmount);

    //Act

    await pulpitPage.topUpReceiverInput.selectOption(topUpReceiver);
    await pulpitPage.topUpAmountInput.fill(topUpAmount);
    await pulpitPage.topUpAgreementCheckBox.click();
    await pulpitPage.topUpExecuteButton.click();
    await pulpitPage.closeButton.click();

    await page.waitForLoadState('domcontentloaded');

    //Assert
    await expect(pulpitPage.moneyValueText).toHaveText(`${expectedBalance}`);
  });
});

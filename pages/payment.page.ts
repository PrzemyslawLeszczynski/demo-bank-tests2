import { Locator, Page } from '@playwright/test';
import { SideMenuComponent } from '../components/side-menu.component';

export class PaymentPage {
  transferReceiverInput: Locator;
  transferToInput: Locator;
  transferAmountInput: Locator;
  transferButton: Locator;
  actionCloseButton: Locator;
  expectedMessage: Locator;
  sideMenuComponent: SideMenuComponent;

  constructor(private page: Page) {
    this.transferReceiverInput = this.page.getByTestId('transfer_receiver');
    this.transferToInput = this.page.getByTestId('form_account_to');
    this.transferAmountInput = this.page.getByTestId('form_amount');
    this.transferButton = this.page.getByRole('button', {
      name: 'wykonaj przelew',
    });
    this.actionCloseButton = this.page.getByTestId('close-button');
    this.expectedMessage = this.page.locator('#show_messages');
    this.sideMenuComponent = new SideMenuComponent(this.page);
  }

  async makeTransfer(
    transferReceiver: string,
    transferAccount: string,
    transferAmount: string,
  ): Promise<void> {
    await this.transferReceiverInput.fill(transferReceiver);
    await this.transferToInput.fill(transferAccount);
    await this.transferAmountInput.fill(transferAmount);

    await this.transferButton.click();
    await this.actionCloseButton.click();
  }
}

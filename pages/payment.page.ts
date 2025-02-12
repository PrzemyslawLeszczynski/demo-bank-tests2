import { Locator, Page } from '@playwright/test';

export class PaymentPage {
  transferReceiverInput: Locator;
  transferToInput: Locator;
  transferAmountInput: Locator;
  transferButton: Locator;
  actionCloseButton: Locator;
  expectedMessage: Locator;

  constructor(private page: Page) {
    this.transferReceiverInput = this.page.getByTestId('transfer_receiver');
    this.transferToInput = this.page.getByTestId('form_account_to');
    this.transferAmountInput = this.page.getByTestId('form_amount');
    this.transferButton = this.page.getByRole('button', {
      name: 'wykonaj przelew',
    });
    this.actionCloseButton = this.page.getByTestId('close-button');
    this.expectedMessage = this.page.locator('#show_messages');
  }
}

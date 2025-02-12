import { Locator, Page } from '@playwright/test';

export class PulpitPage {
  receiverIdInput: Locator;
  transferAmountInput: Locator;
  transferTitleInput: Locator;
  transferButton: Locator;
  closeButton: Locator;
  expectedTransferMessage: Locator;
  topUpReceiverInput: Locator;
  topUpAmountInput: Locator;
  topUpAgreementCheckBox: Locator;
  topUpExecuteButton: Locator;
  expectedTopUpMessage: Locator;
  moneyValueText: Locator;
  userNameText: Locator;

  constructor(private page: Page) {
    this.receiverIdInput = this.page.locator('#widget_1_transfer_receiver');
    this.transferAmountInput = this.page.locator('#widget_1_transfer_amount');
    this.transferTitleInput = this.page.locator('#widget_1_transfer_title');
    this.transferButton = this.page.getByRole('button', { name: 'wykonaj' });
    this.closeButton = this.page.getByTestId('close-button');
    this.expectedTransferMessage = this.page.locator('#show_messages');
    this.topUpReceiverInput = this.page.locator('#widget_1_topup_receiver');
    this.topUpAmountInput = this.page.locator('#widget_1_topup_amount');
    this.topUpAgreementCheckBox = this.page.locator(
      '#uniform-widget_1_topup_agreement span',
    );
    this.topUpExecuteButton = this.page.getByRole('button', {
      name: 'doładuj telefon',
    });
    this.expectedTopUpMessage = this.page.locator('#show_messages');
    this.moneyValueText = this.page.locator('#money_value');
    this.userNameText = this.page.locator('#user_name');
  }
}

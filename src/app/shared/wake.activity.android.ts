@JavaProxy('com.tns.CustomWakingActivity')
export class CustomWakingActivity extends android.app.Activity {
  readonly flags =
    android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
    android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
    android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
    android.view.WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON;

  onCreate(savedInstanceState: android.os.Bundle) {
    super.onCreate(savedInstanceState);
    this.setContentView(android.R.layout.simple_spinner_item);
    this.moveTaskToBack(true);
  }

  onAttachedToWindow() {
    this.turnOn();
  }

  onNewIntent(i: android.content.Intent) {
    if (i.getBooleanExtra('finish', false)) {
      this.turnOff();
      this.finish();
    }
  }

  turnOn() {
    const window = this.getWindow();

    window.addFlags(this.flags);
    window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
  }

  turnOff() {
    const window = this.getWindow();

    window.clearFlags(this.flags);
  }
}

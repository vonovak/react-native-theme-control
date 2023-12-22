package eu.reactnativetraining

import android.content.Context
import android.os.Build
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.common.logging.FLog
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.common.ReactConstants

class ThemeControlModule(reactContext: ReactApplicationContext?) :
    NativeThemeControlSpec(reactContext) {
  override fun getName(): String {
    return NAME
  }

  override fun getThemePreference(): String {
    val preference = AppCompatDelegate.getDefaultNightMode()
    return modeToString(preference)
  }

  @ReactMethod
  override fun setNavbarAppearance(params: ReadableMap, promise: Promise) {
    val bgColor = if (params.isNull("backgroundColor")) null else params.getInt("backgroundColor")
    val dividerColor = if (params.isNull("dividerColor")) null else params.getInt("dividerColor")
    val barStyle = if (params.isNull("barStyle")) null else params.getString("barStyle")

    UiThreadUtil.runOnUiThread {
      val currentActivity = currentActivity
      if (currentActivity == null) {
        FLog.e(ReactConstants.TAG, "$NAME cannot change navbar bgColor, activity is null.")
        return@runOnUiThread
      }
      val window = currentActivity.window
      if (bgColor != null) {
        window.navigationBarColor = bgColor
      }
      if (dividerColor != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        window.navigationBarDividerColor = dividerColor
      }
      if (barStyle != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
        val decorView = window.decorView
        val lightNavigationBars = "dark-content" == barStyle
        WindowInsetsControllerCompat(window, decorView).isAppearanceLightNavigationBars =
            lightNavigationBars
      }
    }
    promise.resolve(null)
  }

  @ReactMethod
  override fun setAppBackground(opts: ReadableMap, promise: Promise) {
    val appBackground = if (opts.hasKey("appBackground")) opts.getInt("appBackground") else null

    val activity = currentActivity

    UiThreadUtil.runOnUiThread {
      if (appBackground != null) {
        activity?.window?.decorView?.setBackgroundColor(appBackground)
      }
    }
    promise.resolve(activity != null)
  }

  @ReactMethod
  override fun setTheme(themeStyle: String, opts: ReadableMap, promise: Promise) {
    val persistTheme = !opts.hasKey("persistTheme") || opts.getBoolean("persistTheme")
    val restartActivity = opts.hasKey("restartActivity") && opts.getBoolean("restartActivity")
    @AppCompatDelegate.NightMode val mode = stringToMode(themeStyle)

    if (persistTheme || restartActivity) {
      persistTheme(mode)
    }

    UiThreadUtil.runOnUiThread { setMode(mode, restartActivity) }
    promise.resolve(null)
  }

  private fun setMode(mode: Int, restartActivity: Boolean) {
    if (restartActivity) {
      val currentActivity = currentActivity
      if (currentActivity != null) {
        // the persisted / cached theme will be picked up
        currentActivity.recreate()
      } else {
        FLog.e(ReactConstants.TAG, "$NAME cannot recreate, activity is null.")
      }
    } else {
      AppCompatDelegate.setDefaultNightMode(mode)
    }
  }

  private fun persistTheme(mode: Int) {
    val prefs = reactApplicationContext.getSharedPreferences(NAME, Context.MODE_PRIVATE)
    val editor = prefs.edit()
    if (mode == AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM) {
      editor.remove(THEME_ENTRY_KEY)
    } else {
      editor.putInt(THEME_ENTRY_KEY, mode)
    }
    editor.apply()
  }

  companion object {
    const val NAME = "RNThemeControl"
    const val THEME_ENTRY_KEY = "ThemeControlModuleEntry"

    fun recoverApplicationTheme(ctx: Context): Int {
      val prefs = ctx.getSharedPreferences(NAME, Context.MODE_PRIVATE)
      val nightMode = prefs.getInt(THEME_ENTRY_KEY, AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
      forceTheme(nightMode)

      return nightMode
    }

    fun forceTheme(forcedMode: Int) {
      UiThreadUtil.assertOnUiThread()
      // setDefaultNightMode is a noop if no change is needed
      AppCompatDelegate.setDefaultNightMode(forcedMode)
    }

    @AppCompatDelegate.NightMode
    fun stringToMode(themeStyle: String?): Int {
      return when (themeStyle) {
        "dark" -> AppCompatDelegate.MODE_NIGHT_YES
        "light" -> AppCompatDelegate.MODE_NIGHT_NO
        else -> AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
      }
    }

    fun modeToString(@AppCompatDelegate.NightMode mode: Int): String {
      return when (mode) {
        AppCompatDelegate.MODE_NIGHT_YES -> "dark"
        AppCompatDelegate.MODE_NIGHT_NO -> "light"
        else -> "system"
      }
    }
  }
}

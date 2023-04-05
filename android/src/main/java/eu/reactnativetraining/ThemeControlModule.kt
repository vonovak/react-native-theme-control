package eu.reactnativetraining

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.UiThreadUtil
import android.content.Context
import com.facebook.react.common.ReactConstants
import android.os.Build
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.common.logging.FLog

@ReactModule(name = ThemeControlModule.NAME)
class ThemeControlModule(reactContext: ReactApplicationContext?) :
  ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String {
    return NAME
  }

  @get:ReactMethod(isBlockingSynchronousMethod = true)
  val themePreference: String
    get() {
      val preference = AppCompatDelegate.getDefaultNightMode()
      return modeToString(preference)
    }

  @ReactMethod
  fun setNavbarAppearance(params: ReadableMap, promise: Promise) {
    val bgColor =
      if (params.isNull("backgroundColor")) null else params.getInt("backgroundColor")
    val dividerColor =
      if (params.isNull("dividerColor")) null else params.getInt("dividerColor")
    val barStyle = if (params.isNull("barStyle")) null else params.getString("barStyle")

    UiThreadUtil.runOnUiThread {
      val currentActivity = currentActivity
      if (currentActivity == null) {
        FLog.e(
          ReactConstants.TAG,
          "$NAME cannot change navbar bgColor, activity is null."
        )
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
  fun setTheme(themeStyle: String, opts: ReadableMap, promise: Promise) {
    val persistTheme = !opts.hasKey("persistTheme") || opts.getBoolean("persistTheme")
    val restartActivity = opts.hasKey("restartActivity") && opts.getBoolean("restartActivity")
    if (persistTheme || restartActivity) {
      persistTheme(themeStyle)
    }
    @AppCompatDelegate.NightMode val mode = stringToMode(themeStyle)
    cachedMode = mode

    UiThreadUtil.runOnUiThread {
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
    promise.resolve(null)
  }

  private fun persistTheme(themeStyle: String) {
    val prefs = reactApplicationContext.getSharedPreferences(
      NAME,
      Context.MODE_PRIVATE
    )
    val editor = prefs.edit()
    @AppCompatDelegate.NightMode val mode = stringToMode(themeStyle)
    editor.putInt(THEME_ENTRY_KEY, mode)
    editor.apply()
  }

  companion object {
    const val NAME = "RNThemeControl"
    const val THEME_ENTRY_KEY = "ThemeControlModuleEntry"
    private var cachedMode: Int? = null

    fun getThemeMode(ctx: Context): Int {
      if (cachedMode != null) {
        return cachedMode!!
      }
      val prefs = ctx.getSharedPreferences(NAME, Context.MODE_PRIVATE)
      @AppCompatDelegate.NightMode val mode =
        prefs.getInt(THEME_ENTRY_KEY, AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
      cachedMode = mode
      return mode
    }

    fun recoverApplicationTheme(ctx: Context): Int {
      val mode = getThemeMode(ctx)
      setMode(mode)
      return mode
    }

    fun forceTheme(forcedMode: Int) {
      setMode(forcedMode)
    }

    private fun setMode(mode: Int) {
      UiThreadUtil.assertOnUiThread()
      // setDefaultNightMode will be a noop if no change is needed
      AppCompatDelegate.setDefaultNightMode(mode)
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
      // TODO more cases might need to be implemented
      return when (mode) {
        AppCompatDelegate.MODE_NIGHT_YES -> "dark"
        AppCompatDelegate.MODE_NIGHT_NO -> "light"
        else -> "auto"
      }
    }
  }
}

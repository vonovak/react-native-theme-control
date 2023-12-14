package eu.reactnativetraining

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.NativeModule
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class ThemeControlPackage : TurboReactPackage() {

  override fun getModule(name: String, ctx: ReactApplicationContext): NativeModule? {
    return if (ThemeControlModule.NAME == name) {
      ThemeControlModule(ctx)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
    val isTurboModule: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
    val moduleName = ThemeControlModule.NAME
    mapOf(
      moduleName to ReactModuleInfo(
        moduleName,
        moduleName,
        false, // canOverrideExistingModule
        false, // needsEagerInit
        false, // hasConstants
        false, // isCxxModule
        isTurboModule // isTurboModule
      )
    )
  }
}

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-theme-control"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/vonovak/react-native-theme-control.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end

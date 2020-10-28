require 'json'

# Returns the version number for a package.json file
pkg_version = lambda do |dir_from_root = '', version = 'version'|
  path = File.join(__dir__, dir_from_root, 'package.json')
  JSON.parse(File.read(path))[version]
end

# Let the main package.json decide the version number for the pod
package_version = pkg_version.call

Pod::Spec.new do |s|
  s.name         = "ReactNativeExceptionHandler"
  s.version      = package_version
  s.summary      = "A react native module that lets you to register a global error handler that can capture fatal/non fatal uncaught exceptions"
  s.description  = <<-DESC
                   A react native module that lets you to register a global error handler that can capture fatal/non fatal uncaught exceptions.
                   The module helps prevent abrupt crashing of RN Apps without a graceful message to the user.
                   DESC
  s.homepage     = "https://github.com/master-atul/react-native-exception-handler"
  s.license      = "MIT"
  s.author       = { "Atul R" => "atulanand94@gmail.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/master-atul/react-native-exception-handler.git", :tag => s.version.to_s }
  s.source_files  = "ios/*.{h,m}"

  s.dependency "React-Core"

end

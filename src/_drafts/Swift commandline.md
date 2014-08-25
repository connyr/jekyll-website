How to run Swift from the commandline:

vim .zshrc

alias swift="/usr/bin/env DEVELOPER_DIR=/[path_to_xcode]/Xcode6-Beta[version_number].app/Contents/Developer xcrun swift"

alias swift="/usr/bin/env DEVELOPER_DIR=/Applications/Xcode6-Beta4.app/Contents/Developer xcrun swift"

start with
import Foundation

and start

quit using the :quit command
and switch to lldb with the ':' operator
go back to the Swift REPL with calling 'repl'

(copied)

The xcrun command will use the DEVELOPER_DIR environment variable to override the currently selected Xcode installation (as set with xcode-select). You can use that to construct a single command that'll run swift on the command line and put you in the REPL. That looks like this:

/usr/bin/env DEVELOPER_DIR=/Applications/Xcode6-Beta.app/Contents/Developer xcrun swift
and you can alias that to just 'swift':

alias swift="/usr/bin/env DEVELOPER_DIR=/Applications/Xcode6-Beta.app/Contents/Developer xcrun swift"
As an interesting side note, you can use the same kind of invocation to run a swift script just like you'd use bash or python by adding a -i:

#!/usr/bin/env DEVELOPER_DIR=/Applications/Xcode6-Beta.app/Contents/Developer xcrun swift -i import Foundation

println("Hello World!")
Of course, once Xcode 6 is released officially and you switch to that as your default developer tools, you can drop the DEVELOPER_DIR=.. bits and just use "xcrun swift".
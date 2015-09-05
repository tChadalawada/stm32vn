# Android USB Accessory Mode #

![http://posterous.com/getfile/files.posterous.com/temp-2011-08-03/uIEbmkzaDizhyIrgmxJrFpaJFICyAjargjvmDBtdouxAeoejAalazoinJvCf/android.jpg.scaled1000.jpg](http://posterous.com/getfile/files.posterous.com/temp-2011-08-03/uIEbmkzaDizhyIrgmxJrFpaJFICyAjargjvmDBtdouxAeoejAalazoinJvCf/android.jpg.scaled1000.jpg)

In the new Android version 2.3.4 (an update to Gingerbread for phones), Google has just added Accessory Mode, which gives the ability to connect to specialty devices they call “accessories” - custom hardware devices, designed to work with specific apps. While researching how to connect custom-built Upverter accessories with Android phones, I started describing the process to myself so I’d remember it - now I figure I should share it with everyone.

So this is a walkthrough of that process to help you understand it a bit more. I’ll go over how the accessory mode process works, so that you can use your own devices which will act as hosts - if you look at the Android ADK and the DemoKit app that comes with it, to control Arduino boards, that’s how they do it. Most of the code here is taken from that app, and the Android docs have a good walkthrough of the process that uses the same code, so check that out for a similar explanation.

# USB Crash Course #

There are two ways to connect a device to an Android phone over USB according to the two device types of the USB spec. Between a USB cable, one device is the host (usually the computer), and one is the device (USB key, camera, Android phone in normal mode, etc.) Wikipedia has a good explanation of the design of it, if you’re curious. Every USB partnership is a hierarchical relationship; the host initiates the connection, the device responds. The messaging system is two-way - the device can send messages to the host, and vice versa - but it’s designed that the host is the one in charge.

Most phones have the ability to connect to a computer as a device, having the computer act as the host. USB devices have multiple “interfaces.” They’re discrete devices within the main device - for example, a webcam might have a microphone and a camera - these are two different parts of the webcam device, and they can operate independently.

Finally, each USB interface has a few “endpoints” which it can send data through. Each endpoint is a different method of sending data - some are optimized for streaming video or audio, some are optimized for sending important commands & interrupts, etc. The Android Docs explain it pretty well - “Typically bulk endpoints are used for sending non-trivial amounts of data. Interrupt endpoints are used for sending small amounts of data, typically events, separately from the main data streams. The endpoint zero is a special endpoint for control messages sent from the host to device.” In a webcam, the camera video stream would have one endpoint, the camera control would have another endpoint, the flash control would have a third...etc.

# Android Crash Course #

If you’re a little rusty, here’s a listing of the basic parts of the Android operating system. Most of these are also the names of the Java classes used - if you run into a class name that you don’t understand, just read it as it is, it’s probably pretty self-explanatory. UsbManager, for example, is an Android class that manages all USB devices and accessories - if you need help with what a certain method does, take a look at the Android docs and use the search to lookup whatever class you want - there’s usually an overview.

**Application/App**: A program for a phone. Applications contain a bunch of different Activities (see below), and Resources (see below, again) in a package that you distribute.

**Resources**: Non-code parts of your program that are provided by you, the App designer. Things like PNG/SVG/JPEG files to draw, XML files for the layout, a file holding all your strings, etc. Most of these are in XML.

**Activity**: An Android screen. Your main menu, the main screen of your game, the “view email” or “compose new SMS” screen, these are all Activities. Sometimes, multiple Activities can cover the screen (especially with tablet-compatible apps, which can use the extra space) and sometimes one Activity can look like multiple “screens,” but that’s the concept, in general. Every Activity has three main states, and there are methods you can override to run functions at certain times:

**Created**, what happens on first run - onCreate() is called. onDestroy() is run on the application closing/quitting.

**Started**, where it’s open as part of the application, but not focused yet. onStart() and onFinish() are pretty self-explanatory. You can have Activities running as “services” in the background, that never formally run (see next point).

**Running** (or unpaused, resumed), where it’s in focus. When it’s brought up, onReusme() runs. As soon as the focus goes away to another Activity, onPause() runs.

**View**: A widget to be displayed. Buttons, text boxes, images, these are all Views. There are a number of standard ones, or you can build your own. ViewGroups are collections of these, they define the whole layout. You can do it in your code, but the preferred method is to separate the structure from the code, defining your layout in XML files. It’s kind of like HTML in that way.

**Broadcast**: A message Android's internal messaging system. When somebody plugs in headphones, slides out the keyboard, connects to a new network, it broadcasts that to every Application in the phone. Applications that want to do something with it can register BroadcastReceiver objects which hook onto that and fire a method (which you overwrite to do what you want) when they're received asynchronously.

**Intent**: A command in Android’s internal command system. Activities can start other Activities by creating Intents, passing the class of the Activity to start to it, adding any Extras (information you can pass to an Activity to influence how it starts - offsets and limits for pagination, session IDs, usernames, whatever), then calling startActivity(intent), passing the intent. It’s convoluted for such a simple action, but it’s used for a lot of things, so it needs to be.

**Manifest**: Every Application has an AndroidManifest.xml which defines the Activities that make it up, ways it can be started, what permissions it needs, and basic metadata (App name, designers, version, etc.)
A note one API levels: Android 2.3.4 is actually Android 2.3.3, with the extra USB libraries added in. Eclipse, the emulator, and the SDK Manager tool will all tell you you’re using “Android 2.3.3” and API Level 10. To get the new libraries, and make sure you’re using the right API level, you have to install the Google APIs from Google Inc., API level 1, [Revision 2](https://code.google.com/p/stm32vn/source/detail?r=2). This provides the com.android.future.usb.**libraries, which are for 2.3.4 - Android 3.1 and future versions will use android.hardware.usb.** libraries, API Level 12. It’s kind of confusing, I agree, but that’s how it’s set up. There’s more information on the Google APIs site, as well as the Android Docs for USB Accessories, under [Choosing the Right USB Accessory APIs.](http://developer.android.com/guide/topics/usb/accessory.html)


# Accessories #

Accessories are specific devices which act as the host while the phone acts as the device, allowing it to interact with the device while plugged in. It’s designed to have a simpler process than the regular USB devices, which makes them pretty easy. All connections are initiated by the accessory, so all the phone has to do is respond and do whatever it wants with the data that comes in. The Android Open Development Kit uses an Arduino board which uses this method. I’ll walk you through the process step-by-step.

A note on errors: I’m not the biggest fan of how Android handles errors, it tends to fall back onto semi-working methods, but not tell you very explicitly that something’s gone wrong. For example, I’d placed the 

&lt;uses-library&gt;

 tag in the wrong place (not inside the 

&lt;application&gt;

 tag) in the manifest (see the section below). This didn’t throw an error in itself, but simply wouldn’t load the library and threw a bunch of “Class not defined” errors down the line (despite the fact that the library was imported). I noticed the problem and corrected it after several frustrating hours - It’s tough, but try to make sure you have everything in the right place.

# Receive the “Accessory Connected” Broadcast #

The whole process is going to start when something is plugged in. You’ll need to set your AndroidManifest.xml to state that your app uses the accessory library, with this under the `<application>` tag:

```
<uses-library android:name="com.android.future.usb.accessory" />
```

The next step is to set up your manifest to set one Activity as the BroadcastReceiver of the "new USB accessory attached" message. Just like "new mail received" BroadcastReceiver actions, you add an Intent Filter to the Activity and it will start. The next is to add the Add this section under the Activity you want to be started when a device is plugged in.

```
<intent-filter>
    <action android:name="android.hardware.usb.action.USB_ACCESSORY_ATTACHED" />
</intent-filter>
<meta-data
    android:name="android.hardware.usb.action.USB_ACCESSORY_ATTACHED"
    android:resource="@xml/accessory_filter" />
```

You can add additional metadata in an XML file in res/xml/ to specify the device (you can add a class, protocol, and subclass onto that). This is referred to in the metadata tag above (android:resource="@xml/accessory\_filter" - see it?), it looks for res/xml/accessory\_filter.xml, which contains this:

```
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <usb-accessory manufacturer="Upverter" model="TestBoard" version="1.0" />
</resources>
```

The manufacturer, model and version will be broadcast by your device and would be programmed into it specifically - if you’re using an Arduino, you’ll set this there. Now your Activity will start whenever the USB\_ACCESSORY\_ATTACHED message is sent out for your specific device. If you want, instead of specifying a device, you can also hook onto all USB messages and use your app to determine which device is yours - it gives you more flexibility than the XML method gives if you need it.

# Getting the Accessory #

Once your Activity has been started, you need to get the UsbAccessory object so that you can start getting data from it. In 2.3.4 you get the accessory by extracting it from the intent - the UsbManager class helps you with this:

```
sbAccessory accessory = UsbManager.getAccessory(intent);
```

In 3.1, the device is packaged with the Intent as an Extra. You can retrieve it with:

If that doesn't tickle you, or if you're not sure what accessory you'll attach (or if there could be multiple accessories attached - hey, it could happen), you can use the UsbManager and get a list of all the accessories attached. Getting the UsbManager is different in 2.3.4 and 3.1 - In 2.3.4 it’s:

```
UsbManager manager = UsbManager.getInstance(this);
```

Once you have the manager, you can retrieve an array of all attached Accessories and iterate through it with a loop, finding the one you want (or, hell, doing something with all of them). In the example here we just get the first device, but you could just as easily run a for loop over them and check the UsbAccessory’s properties.

```
UsbAccessory[] accessories = mUsbManager.getAccessoryList();
UsbAccessory accessory = (accessories == null ? null : accessories[0]);
```

# Handling Other Events #

Because this is an asynchronous operation (we can’t know before hand when the user will plug in the accessory, or when they will unplug it) we should set the Activity to handle other USB events, like unplugging or receiving permission from the user. Using this, we can gray out the screen or display “USB Accessory has been unplugged, please plug it back in,” otherwise the application will just crash if the UsbAccessory is no longer available.

```
private final BroadcastReceiver mUsbReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (ACTION_USB_PERMISSION.equals(action)) {

            // Start whatever connection you need.

        } else if (UsbManager.ACTION_USB_ACCESSORY_DETACHED.equals(action)) {

            // Close the Accessory and notify the user if it’s been detached.

        }
    }
};
```

To start the connection, you have to wait for the user to allow your app to connect to the device - although if the activity was started from an Intent Filter, the user was asked for permission when your Activity opened. To handle this permission broadcast, you have to wait for the user to send you ANOTHER Broadcast when they hit "grant permission” (this is the ACTION\_USB\_PERMISSION action shown above). Within that block, this code checks whether permission was granted or rejected.

```
// Start whatever connection you need.
// Check to see if permission was granted. If so, open the Accessory for use.
synchronized (this) {
    UsbAccessory accessory = UsbManager.getAccessory(intent);
    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
        openAccessory(accessory);
    } else {
        Log.d(TAG, "permission denied for accessory " + accessory);
    }
}
```

And when the connection is broken - the USB\_ACCESSORY\_DETACHED action runs, we use this code to close the accessory.

```
// Close the Accessory if it’s been detached.
UsbAccessory accessory = UsbManager.getAccessory(intent);
if (accessory != null && accessory.equals(mAccessory)) {
    closeAccessory();
}
```

Pretty straightforward - the openAccessory(UsbAccessory) and closeAccessory() methods will be defined farther down the page. Now that we we know it’s been plugged in, we have the accessory and we have permission to use it, we can open it to send data.

# Sending Data #

The example I’m following - the DemoKit from the Android ADK - uses OpenAccessory(UsbAccessory) and closeAccessory() as functions to...well...open and close the UsbAccessory. What they do, essentially, is create a FileInputStream and a FileOutputStream. When you want to read data from the Accessory, you just read it from the FileInputStream. When you want to send data to the Accessory, you write it to the FileOutputStream. The openAccessory(UsbAccessory) method initializes all of this, and sets up a new Thread to run the polling code in. Essentially, it runs a while loop that runs forever, and checks the status of the FileInputStream, looking for commands.

```
private void openAccessory(UsbAccessory accessory) {
    mFileDescriptor = mUsbManager.openAccessory(accessory);
    if (mFileDescriptor != null) {
        mAccessory = accessory;
        FileDescriptor fd = mFileDescriptor.getFileDescriptor();
        mInputStream = new FileInputStream(fd);
        mOutputStream = new FileOutputStream(fd);
        Thread thread = new Thread(null, this, "DemoKit");
        thread.start();
        Log.d(TAG, "accessory opened");
        enableControls(true);
    } else {
        Log.d(TAG, "accessory open fail");
    }
}
```

closeAccessory() is also pretty simple, it just closes the Accessory and sets the File Descriptors to null.

```
private void closeAccessory() {
    enableControls(false);
    try {
        if (mFileDescriptor != null) {
            mFileDescriptor.close();
        }
    } catch (IOException e) {
    } finally {
        mFileDescriptor = null;
        mAccessory = null;
    }
}
```

To send data, we have a Command, a Target and a value to write to the FileOutputStream.

```
public void sendCommand(byte command, byte target, int value) {
    byte[] buffer = new byte[3];
    if (value > 255)
        value = 255;

    buffer[0] = command;
    buffer[1] = target;
    buffer[2] = (byte) value;
    if (mOutputStream != null && buffer[1] != -1) {
        try {
            mOutputStream.write(buffer);
        } catch (IOException e) {
            Log.e(TAG, "write failed", e);
        }
    }
}
```

The commands and targets are dependant on each device, so it will be something you’ll have to look up or set yourself. If you’re interfacing with an Arduino, however, they’re yours to define - in the DemoKit Activity they have one command parameter for LEDs & Servos, and one for joysticks. The target defines the actual pin that the command goes to, and the value is the analog value to send to that pin. Updating a tricolor LED is as simple as this, where red, green, blue and DemoKitActivity.LED\_SERVO\_COMMAND are all just integer values, converted to bytes. Do yourself a favour and use constants everywhere - it’s sure better than trying to memorize which of 0x1, 0x2 and 0x0 are for LEDs.

```
mActivity.sendCommand(DemoKitActivity.LED_SERVO_COMMAND, (byte) 0, (byte) red);
mActivity.sendCommand(DemoKitActivity.LED_SERVO_COMMAND, (byte) 1, (byte) green);
mActivity.sendCommand(DemoKitActivity.LED_SERVO_COMMAND, (byte) 2, (byte) blue);
```

The Arduino interprets that command and deals with it - here is the Arduino code that will work out what to do. You can see the first part of the byte string (DemoKitActivity.LED\_SERVO\_COMMAND, which evaluates to 0x2 and is the first part of the byte array) coming into play.

```
if (len > 0) {
    // assumes only one command per packet
    if (msg[0] == 0x2) {
        if (msg[1] == 0x0)
            analogWrite(LED1_RED, 255 - msg[2]);
        else if (msg[1] == 0x1)
            analogWrite(LED1_GREEN, 255 - msg[2]);
        else if (msg[1] == 0x2)
            analogWrite(LED1_BLUE, 255 - msg[2]);
        else if (msg[1] == 0x3)
            analogWrite(LED2_RED, 255 - msg[2]);
        else if (msg[1] == 0x4)
            analogWrite(LED2_GREEN, 255 - msg[2]);
        else if (msg[1] == 0x5)
            analogWrite(LED2_BLUE, 255 - msg[2]);
        else if (msg[1] == 0x6)
            analogWrite(LED3_RED, 255 - msg[2]);
        else if (msg[1] == 0x7)
            analogWrite(LED3_GREEN, 255 - msg[2]);
        else if (msg[1] == 0x8)
            analogWrite(LED3_BLUE, 255 - msg[2]);
        else if (msg[1] == 0x10)
            servos[0].write(map(msg[2], 0, 255, 0, 180));
        else if (msg[1] == 0x11)
            servos[1].write(map(msg[2], 0, 255, 0, 180));
        else if (msg[1] == 0x12)
            servos[2].write(map(msg[2], 0, 255, 0, 180));
    } else if (msg[0] == 0x3) {
        if (msg[1] == 0x0)
            digitalWrite(RELAY1, msg[2] ? HIGH : LOW);
        else if (msg[1] == 0x1)
            digitalWrite(RELAY2, msg[2] ? HIGH : LOW);
    }
}
```

Not too bad. The three-byte command structure isn’t mandatory - it’s just what’s being used in this case, it gives a lot of flexibility while not being too big of a packet.

# Receiving Data #

Receiving data happens in a while loop, it basically reads the FileInputStream and processes the buffer. The Activity is a Runnable class, which means it has a run() method and can be started as a new Thread, which is constantly running alongside the main program (so that it doesn’t interrupt the main UI drawing thread - that would heavily lag the device while reading data). Don’t worry about running this method manually - it is called automatically after the thread is started in openAccessory().

```
public void run() {
    int ret = 0;
    byte[] buffer = new byte[16384];
    int i;

    while (ret >= 0) {
       try {
           ret = mInputStream.read(buffer);
       } catch (IOException e) {
           break;
       }
       i = 0;
       while (i < ret) {
            int len = ret - i;
            switch (buffer[i]) {
            case 0x1:
                if (len >= 3) {
                    Message m = Message.obtain(mHandler, MESSAGE_SWITCH);
                    m.obj = new SwitchMsg(buffer[i + 1], buffer[i + 2]);
                    mHandler.sendMessage(m);
               }
               i += 3;
               break;
           case 0x4:
               if (len >= 3) {
                   Message m = Message.obtain(mHandler, MESSAGE_TEMPERATURE);
                   m.obj = new TemperatureMsg(composeInt(buffer[i + 1], buffer[i + 2]));
                   mHandler.sendMessage(m);
               }
               i += 3;
               break;
           case 0x5:
               if (len >= 3) {
                   Message m = Message.obtain(mHandler, MESSAGE_LIGHT);
                   m.obj = new LightMsg(composeInt(buffer[i + 1], buffer[i + 2]));
                   mHandler.sendMessage(m);
               }
               i += 3;
               break;
           case 0x6:
               if (len >= 3) {
                   Message m = Message.obtain(mHandler, MESSAGE_JOY);
                   m.obj = new JoyMsg(buffer[i + 1], buffer[i + 2]);
                   mHandler.sendMessage(m);
               }
               i += 3;
               break;
           default:
               Log.d(TAG, "unknown msg: " + buffer[i]);
               i = len;
               break;
           }
       }
    }
}
```

Check out the source code up there - there’s a while loop that reads the buffer and processes it, byte by byte. If the buffer byte’s value is something we recognize (set as one of the constants - MESSAGE\_SWITCH, MESSAGE\_TEMPERATURE, MESSAGE\_LIGHT or MESSAGE\_JOY) then we run whatever code we want (in this example, they use a Handler to send messages back and forth between the threads asynchronously).

# Activity Structure #

The best way to get a grasp on what’s all happening is to take a look at the full DemoKitActivity.java code in the ADK. Here’s a brief overview of the structure they use - what they do for a basic asynchronous input device is:

onCreate() - Sets the USB Manager and registers the USB events receiver now that the Activity’s been opened. If we have a getLastNonConfigurationInstance(), it opens the Accessory from that (It’s not completely necessary, it just saves having to load it again. See the full source code & docs for more info on what exactly they’re doing.)

```
/** Called when the activity is first created. */
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    mUsbManager = UsbManager.getInstance(this);
    mPermissionIntent = PendingIntent.getBroadcast(this, 0, new Intent(ACTION_USB_PERMISSION), 0);
    IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
    filter.addAction(UsbManager.ACTION_USB_ACCESSORY_DETACHED);
    registerReceiver(mUsbReceiver, filter);

    if (getLastNonConfigurationInstance() != null) {
        mAccessory = (UsbAccessory) getLastNonConfigurationInstance();
        openAccessory(mAccessory);
    }

    setContentView(R.layout.main);
    enableControls(false);
```

onDestroy()- Nothing special, just calls the superclass’s onDestroy method and unregisters the broadcast receiver.

```
@Override
public void onDestroy() {
    unregisterReceiver(mUsbReceiver);
    super.onDestroy();
}
```

onResume()- Here’s where the Accessory is loaded, the permission is granted and everything is set for use.

```
Override
public void onResume() {
    Intent intent = getIntent();
    if (mInputStream != null && mOutputStream != null) {
        return;
    }

    UsbAccessory[] accessories = mUsbManager.getAccessoryList();
    UsbAccessory accessory = (accessories == null ? null : accessories[0]);
    if (accessory != null) {
        if (mUsbManager.hasPermission(accessory)) {
            openAccessory(accessory);
        } else {
            synchronized (mUsbReceiver) {
                if (!mPermissionRequestPending) {
                    mUsbManager.requestPermission(accessory, mPermissionIntent);
                    mPermissionRequestPending = true;
                }
            }
        }
    } else {
        Log.d(TAG, "mAccessory is null");
    }
}
```

onPause()- Very simple, it just closes the Accessory, so that we’re not taking up resources we don’t need while we’re not in focus. Basically undoing the work of onResume().

```
@Override
public void onPause() {
    super.onPause();
    closeAccessory();
}
```

And that’s it! It might be a little hard to put together in your head, but take a look at the DemoKit Activity in the ADK and it should show you a better overview. Many of the commands are across a few Activities, but DemoKitActivity.java is the main one. The sendCommand actions all happen in one of the individual Controller classes (like ColorWheelLEDController.java), so that should get you started. Get hacking!


---

Reference acticle from :

http://resources.upverter.com/android-usb-accessory-mode
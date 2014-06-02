---
layout: post
title: "Playing a Sound with AVAudioPlayer"

bgcolor: bgcolor-emerald-green
thumbnail: icons_blog-dummy.svg
banner: icons_stopwatch.svg

categories: 
- blog
tags:
- ios
- objective-c
---

How to use AVAudioPlayer and AVAudioSession to play a sound. I used this in my timer app prototype to play a sound when the timer reaches zero.
<!-- more -->

[**Use case and source in AlarmClock project on github**](https://github.com/connyr/ios-projects/tree/master/Numbers/AlarmClock)

I first imported the Audio & Video Framework and add a property for the audio player

    #import <AVFoundation/AVFoundation.h>
    @interface CRTimerViewController : UIViewController <UIAlertViewDelegate>
    @property(nonatomic, strong) AVAudioPlayer* audioPlayer;
    ...

The sound file I want to play can added to the project via drag and drop or addFileToProject.

I want to play the sound when the timer is finished and an alert view is shown.

    - (void)showCountDownFinishedAlert
    {
        UIAlertView* alertView = [[UIAlertView alloc] initWithTitle:@"Timer finished"
                                                            message:@"Dismiss to Close."
                                                           delegate:self
                                                  cancelButtonTitle:@"OK"
                                                  otherButtonTitles:nil];
        [self playSound];
        [alertView show];
    }

To play the sound:

    - (void)playSound
    {
        NSError* audioSessionError = nil;
        AVAudioSession* audioSession = [AVAudioSession sharedInstance];
        if ([audioSession setCategory:AVAudioSessionCategoryPlayback
                                error:&audioSessionError]) {
            NSLog(@"Successfully set the audio session.");
        } else {
            NSLog(@"Could not set the audio session");
        }
        dispatch_queue_t dispatchQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
        dispatch_async(dispatchQueue, ^(void) {
            NSBundle *mainBundle = [NSBundle mainBundle];
            NSString *filePath = [mainBundle pathForResource:@"Annoying_Alarm_Clock-UncleKornicob"
                                                      ofType:@"mp3"];
            NSData *fileData = [NSData dataWithContentsOfFile:filePath];
            NSError *audioPlayerError = nil;
            
            self.audioPlayer = [[AVAudioPlayer alloc]
                                initWithData:fileData
                                error:&audioPlayerError];
            
            if (self.audioPlayer != nil){
                if ([self.audioPlayer prepareToPlay] && [self.audioPlayer play]){ 
                    NSLog(@"Successfully started playing.");
                }else{
                    NSLog(@"Failed to play the audio file."); self.audioPlayer = nil;
                }
            }else{
                NSLog(@"Could not instantiate the audio player.");
            }
        });
    }

First, I get a reference to the AudioSession Singleton and set the audio session category that is needed (Ambient, Playback, Record and more).

After that, I dispatch an asynchronous process that

 + Loads the audio file resource
 + Creates the audio player
 + Plays the audio sound

In caes you want to handle interruptions and other audio player events, you will have to implement the AVAudioPlayerDelegate protocoll and set the audioplayer delegate to your view controller.

To stop the audio, I used the UIAlertView delegate methods to get notified when alertview gets dismissed and the sound can stop.

    - (void)alertView:(UIAlertView*)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex
    {
        [self.audioPlayer stop];
        [[self getTimerView] stopTimer];
    }

And the final result (be happy you cannot hear the annoying sound ..)

{% img class /assets/2014-02-21-timer-alert.png 'screen shot' 'timer with alert' %}

Conny




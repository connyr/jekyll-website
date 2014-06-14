---
layout: post
title: "Simple Fractions Part 2" 

bgcolor: bgcolor-dark-blue
thumbnail: icons_fraction.svg

isFeaturedClass: cs2

categories: 
- blog
tags:
- ios
- objective-c
---
This time we will extend our existing prototype from Part 1 with more advanced functionalities.
The source code is available on [github](https://github.com/connyr/ios-projects/tree/master/Numbers/Fractions).

###Todo

 - Decimal value of a fraction
 - Create fraction from a decimal value
 - Greatest Common Divisor (gcd) with euclidial algorithm
 - Simplify Fractions

We will also implement the necessary user interface to interact with our fractions.

 - Storyboard skeleton
 - Linking buttons to methods
 - Parsing input to create fractions
 - Show results

<!-- more -->
###Extending the Logic

First, let's create a method, that returns the decimal value of a fraction.

	- (double)decimalValue
	{
	    double value = (double)self.numerator / self.denominator;
	    return value;
	}
We can use this to display the fraction to the user in an alternate format. Another useful functionality would be to create the fraction out of a decimal number, like 0.345. To do this, we declare another init method that takes a decimal as parameter and creates a fraction object out of it. 
	
	- initWithDecimal:(double)decimalValue
	{
	    self = [super init];
	    if (self) {
	        [self setToDecimalValue:decimalValue];
	    }
	    return self;
	}

To create a fraction out of decimal, we normally write the whole decimal as integer into the numerator and set the denominator to 1, followed by as many zeroes as there are digits to the right of the decimal point of the decimal.

Now, with floating point variables it can be difficult to determine the amount of numbers following the decimal point.
> See [Accuracy problems](http://en.wikipedia.org/wiki/Floating_point#Accuracy_problems).
> Stackoverflow also has an interesting discussion on this challenge [Here](http://stackoverflow.com/questions/95727/how-to-convert-floats-to-human-readable-fractions).

>  [What Every Computer Scientist Should Know About Floating-Point Arithmetic](http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) is also very informative.

To go around this, I convert the given decimal to a large number. First I set the  denominator to 1.000.000 and then multiply it with the decimal to get the numerator. After that we can simplify it with the gcd (that we now need to calculate). This solution has a limited precicion, but feel free to optimize it.

	- (void)setToDecimalValue:(double)decimal;
	{
	    self.numerator = floor(decimal * 1000000);
	    self.denominator = 1000000;
	    [self simplify];
	}

To simplify a fraction we find the the greatest common divisor(gcd) and divide both the nominator and the denominator by it.

	- (void)simplify
	{
	    NSInteger gcd = [self greatestCommonDividerForNumber:self.numerator
	                                              withNumber:self.denominator];
	    self.numerator /= gcd;
	    self.denominator /= gcd;
	} 

We can choose from different methods to find the gcd [more info here](http://en.wikipedia.org/wiki/Greatest_common_divisor). I decided to use **euclids algorithm**.

	- (NSInteger)greatestCommonDividerForNumber:(NSInteger)num1 withNumber:(NSInteger)num2
	{
		// euclids algorithm
	    while (num2 != 0) {
	        NSInteger remainder = num1 % num2;
	        num1 = num2;
	        num2 = remainder;
	    }
	    return num1;
	}

So much for the logic part. Now we will create a user interface to actually try it out.

###Creating the UI

First, I created a new UIViewController subclass, called CRFractionViewController.
After that I added a new Storyboad to my project, and equipped it with a generic ViewController that is set to our custom class CRFractionViewController and added a number of controls that can be seen in the following picture:

{% img class /assets/2014-02-12-fraction-2-0.png 'screen shot' 'image of the skeleton' %}

After I connected the labels outlets and the button actions to my view controller's header, this is what it looks like: 
	
	#import <UIKit/UIKit.h>

	@interface CRFractionViewController : UIViewController <UIAlertViewDelegate>

	@property(weak, nonatomic) IBOutlet UILabel* leftNumeratorLabel;
	@property(weak, nonatomic) IBOutlet UILabel* leftDenominatorLabel;

	@property(weak, nonatomic) IBOutlet UILabel* rightNumeratorLabel;
	@property(weak, nonatomic) IBOutlet UILabel* rightDenominatorLabel;

	@property(weak, nonatomic) IBOutlet UILabel* resultNumerator;
	@property(weak, nonatomic) IBOutlet UILabel* resultDenominator;

	- (IBAction)addFractions:(UIButton*)sender;
	- (IBAction)subtractFractions:(UIButton*)sender;
	- (IBAction)multiplyFractions:(UIButton*)sender;
	- (IBAction)divideFractions:(UIButton*)sender;

	- (IBAction)changeLeftFraction:(UIButton*)sender;
	- (IBAction)changeRightFraction:(UIButton*)sender;

	@end


###Defining UI Functionality

We now need to import our Fraction model and set some initial values in the viewDidLoad. We also need two properties, frac1 and frac2, to save our fractions.

	#import "CRFractionViewController.h"

	#import "CRFraction.h"

	@interface CRFractionViewController ()

	@property(strong, nonatomic) CRFraction* frac1;
	@property(strong, nonatomic) CRFraction* frac2;
	@property(strong, nonatomic) CRFraction* editingFraction;

	@end

	@implementation CRFractionViewController

	- (void)viewDidLoad
	{
	    [super viewDidLoad];

	    self.frac1 = [[CRFraction alloc] initWithNumerator:1
	                                       withDenominator:5];

	    self.frac2 = [[CRFraction alloc] initWithNumerator:3
	                                       withDenominator:5];

	    self.resultDenominator.text = @"";
	    self.resultNumerator.text = @"";

	    [self updateFractionLabels];
	    // Do any additional setup after loading the view.
	}

The updateFractionLabels method does nothing more, than resetting the text in our labels.

	- (void)updateFractionLabels
	{
	    [self.frac1 normalize];
	    self.leftNumeratorLabel.text = [NSNumber numberWithInt:self.frac1.numerator].stringValue;
	    self.leftDenominatorLabel.text = [NSNumber numberWithInt:self.frac1.denominator].stringValue;

	    [self.frac2 normalize];
	    self.rightNumeratorLabel.text = [NSNumber numberWithInt:self.frac2.numerator].stringValue;
	    self.rightDenominatorLabel.text = [NSNumber numberWithInt:self.frac2.denominator].stringValue;
	}

Now we link the four function buttons +,-,\*,/ with our functions from CRFraction.

	- (IBAction)addFractions:(UIButton*)sender
	{
	    CRFraction* result = [CRFraction fractionByAdding:self.frac1
	                                                   to:self.frac2];
	    [self updateResultWithFraction:result];
	}

	- (IBAction)subtractFractions:(id)sender
	{
	    CRFraction* result = [CRFraction fractionBySubtracting:self.frac2
	                                                      from:self.frac1];
	    [self updateResultWithFraction:result];
	}

	- (IBAction)multiplyFractions:(id)sender
	{
	    CRFraction* result = [CRFraction fractionByMultiplying:self.frac1
	                                                      with:self.frac2];
	    [self updateResultWithFraction:result];
	}

	- (IBAction)divideFractions:(UIButton*)sender
	{
	    CRFraction* result = [CRFraction fractionByDividing:self.frac1
	                                                     by:self.frac2];
	    [self updateResultWithFraction:result];
	}

And show the results to the user by updating the result labels.

	- (void)updateResultWithFraction:(CRFraction*)result
	{
	    self.resultNumerator.text = [NSNumber numberWithInt:result.numerator].stringValue;
	    self.resultDenominator.text = [NSNumber numberWithInt:result.denominator].stringValue;
	}

The only thing left to do is to create an intup option for the user to enter new fractions.
In the original layout I added two system buttons with a + sign. If those are pressed, we present an input to the user to enter a new fraction. We also need to remember which fraction we are editing.

	- (IBAction)changeLeftFraction:(id)sender
	{
	    self.editingFraction = self.frac1;
	    [self showFractionInput];
	}

	- (IBAction)changeRightFraction:(UIButton*)sender
	{
	    self.editingFraction = self.frac2;
	    [self showFractionInput];
	}

For the input I've choosen UIAlertView with a text input. Our ViewController also implements the UIAlertViewDelegate protocol in the header, so that we can handle notifications. The UIAlertView will present a message dialog into which a number is entered, using a number-based keyboard. As input, we either accept decimals( 1.463 ) or fractions( 3/4 ).


	- (void)showFractionInput
	{
	    UIAlertView* inputDialog = [[UIAlertView alloc] initWithTitle:@"Please enter your fraction"
	                                                          message:@"You can enter two integers with a slash: 1/4 . Or you can enter a decimal number: 2.75 "
	                                                         delegate:self
	                                                cancelButtonTitle:@"Cancel"
	                                                otherButtonTitles:@"OK", nil];
	    
	    [inputDialog setAlertViewStyle:UIAlertViewStylePlainTextInput];

	    UITextField* textField = [inputDialog textFieldAtIndex:0];
	    textField.keyboardType = UIKeyboardTypeNumbersAndPunctuation;

	    [inputDialog show];
	}

To access the user input, we implement one of the alertview delegate methods, so that we are notified when the user input is finished.

	#pragma mark UIAlertView delegate methods
	- (void)alertView:(UIAlertView*)alertView
	    clickedButtonAtIndex:(NSInteger)buttonIndex
	{
	    if (buttonIndex == 0) // cancel
	    {
	        return;
	    } else {
	        [self parseFractionInput:[alertView textFieldAtIndex:0].text];
	    }
	}

In the parsing method, we test if our expected formats are matched and set our respective fraction values. I we cannot parse the input an alert is raised.

	- (void)parseFractionInput:(NSString*)inputText
	{
	    NSArray* components = [inputText componentsSeparatedByString:@"/"];
	    if (components.count == 2) {
	        self.editingFraction.numerator = ((NSString*)components[0]).integerValue;
	        self.editingFraction.denominator = ((NSString*)components[1]).integerValue;
	        [self updateFractionLabels];
	    } else if (inputText.doubleValue) {
	        [self.editingFraction setToDecimalValue:inputText.doubleValue];
	        [self updateFractionLabels];
	    } else {
	        [self showParsingAlertWithText:inputText];
	    }
	}

Now, if not already implemented, we add our viewcontroller to the window in the AppDelegate

    [self.window makeKeyAndVisible];

    self.window.rootViewController = [[UIStoryboard storyboardWithName:@"Storyboard"
                                                                bundle:nil] instantiateInitialViewController];
    return YES;

And we're done!
If you run the app now, you can edit the fractions.

{% img class /assets/2014-02-12-fraction-2-1.png 'screen shot' 'image of the final app' %}

And also use add, multiply, etc., and see the result!

{% img class /assets/2014-02-12-fraction-2-2.png 'screen shot' 'image of the final app' %}



####Personal Conclusion: Blogging this was an interesting experiment. But writing all of this takes quite a lot of time. Even more than the implementation, actually. For the next few projects I will try to keep it short and summarize the challenges and learnings instead. The code is after all available on github for reverse engineering ;)

'til text time

\- Conny

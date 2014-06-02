---
layout: post
title: "Simple Fractions Part 1" 

bgcolor: bgcolor-emerald-green
thumbnail: icons_blog-dummy.svg
banner: icons_stopwatch.svg


categories: 
- blog
tags:
- ios
- objective-c
---
  Let's create a program that handles calculations with fractions. We want to add, subtract, multiplicate and divide the fractions with each other. 
<!-- more -->

  Later, we might want to display the fractions as percents and decimals. Or as mixed numbers. Or just do something fancy with it.

The source code is available on [github](https://github.com/connyr/ios-projects/tree/master/Numbers/Fractions).

###Analyse the Tasks

**Fractions** are usually displayed with a **numerator** on top, a dividing slash, and a non-zero **denominator** at the bottom. Check [Wikipedia](http://en.wikipedia.org/wiki/Fraction_(mathematics)) for more info.


Model/Logic

 - Datastructure/Class for **Fraction**
 - Addition: Adds two fractions numerators. If the denominators don't match we have to find the a common denominator, before we can sum up the numerators.
 - Subtraction: Same as Addition, but subtracting the numerators instead.
 - Multiplication: Multiply the numerators and multiply the denumerators.
 - Division: Divide first fraction by multiplying it with the reciprocal of the second fraction

User should be able to

 - Change the fraction's numerators and denumerators
 - Choose the operation (+,-,\*,/)
 - View the result

So much for the basics. After implementing these, we could also visualize the fractions in pie diagrams to visualize how the fractions look before and after the calculations.

First, we create a new class, called CRFraction, a subclass of NSObject, as our data model. So, the header file will look like this:
	
	#import <Foundation/Foundation.h>

	@interface CRFraction : NSObject

	@property(nonatomic) NSInteger numerator; // number above the slash
	@property(nonatomic) NSInteger denominator; //number below the slash

	- (CRFraction*)addFraction:(CRFraction*)anotherFraction;
	- (CRFraction*)subtractFraction:(CRFraction*)anotherFraction;
	- (CRFraction*)multiplyWithFraction:(CRFraction*)anotherFraction;
	- (CRFraction*)divideWithFraction:(CRFraction*)anotherFraction;

	+ (CRFraction*)fractionByAdding:(CRFraction*)op1 to:(CRFraction*)op2;
	+ (CRFraction*)fractionBySubtracting:(CRFraction*)op1 from:(CRFraction*)op2;
	+ (CRFraction*)fractionByMultiplying:(CRFraction*)op1 with:(CRFraction*)op2;
	+ (CRFraction*)fractionByDividing:(CRFraction*)op1 by:(CRFraction*)op2;

(The leading CR in the classname is just my personal class prefix). I defined two properties,** numerator ** and ** denominator ** that will hold the values of the fraction. I also defined some instance and class methods that we will fill soon.

 With this, we can later add two fractions, ** a ** and ** b ** , either by calling 

	[a addFraction:b];

or by using the class method.

	[CRFraction fractionByAdding: a to: b];

In the first case, the actual values of ** a ** are changed and returned. In the second example, ** a ** and ** b ** are not changed and we receive a new CRFraction object as a result.

Now, let's fill in the actual logic.

###The Logic

####Addition
If both fractions share the same denominators, we only need to add the numerators to each other. Otherwise we have to find a common denominator for both fractions.
To find the common denominator we will for now use the simple, but not optimized [cross-product method](http://en.wikipedia.org/wiki/Fraction_(mathematics)#Adding_unlike_quantities). 

	+ (CRFraction*)fractionByAdding:(CRFraction*)op1
	                             to:(CRFraction*)op2
	{
	    CRFraction* result = [[CRFraction alloc] init];
	    if (op1.denominator == op2.denominator) {
	        result.numerator = op1.numerator + op2.numerator;
	        result.denominator = op1.denominator;
	    } else {
	        // Find a common denominator with the crossproduct
	        result.numerator = (op1.numerator * op2.denominator) + (op1.denominator * op2.numerator);
	        result.denominator = op1.denominator * op2.denominator;
	    }
	    [result normalize];
	    return result;
	}

For the instance method, we can make use of the class method by using the instance as a parameter.

	- (CRFraction*)addFraction:(CRFraction*)anotherFraction
	{
	    CRFraction* result = [CRFraction fractionByAdding:anotherFraction
	                                                   to:self];
	    [self copyValuesFromFraction:result];
	    return self;
	}

First, we call the class method with the parameter and our instance. The we copy the values with in the result to our current instance in the ** copyValuesFromFraction: ** method.

	- (void)copyValuesFromFraction:(CRFraction*)result
	{
	    self.numerator = result.numerator;
	    self.denominator = result.denominator;
	}

####Subtraction

Subtraction works similar to Addition. But what if the operation has a negative result? We should normalize negative values in our fractions after the operations before the returns.

	+ (CRFraction*)fractionBySubtracting:(CRFraction*)op1 from:(CRFraction*)op2
	{
	    CRFraction* result = [[CRFraction alloc] init];
	    if (op1.denominator == op2.denominator) {
	        result.numerator = op2.numerator - op1.numerator;
	        result.denominator = op2.denominator;
	    } else {
	        // Find a common denominator with the crossproduct
	        result.numerator = (op1.denominator * op2.numerator) - (op1.numerator * op2.denominator);
	        result.denominator = op1.denominator * op2.denominator;
	    }
	    [result normalize];
	    return result;
	}

	- (CRFraction*)subtractFraction:(CRFraction*)anotherFraction
	{
	    CRFraction* result = [CRFraction fractionBySubtracting:anotherFraction
	                                                      from:self];
	    [self copyValuesFromFraction:result];
	    return self;
	}

The subtraction now looks nearly identical to the previous method, except for minus the operator.
 > Note: I see parts, where we could optimize this method already, e.g., sending the operator as a parameter so that both addition and subtraction could be handled by the same method... But, I want to avoid premature optimization for now. 
		
I also defined a new method, normalize, that will take care of negative fractions. If both parts are negative, then we can normalize it to a positive fraction. Also, If only the denominator is negative, if want to switch signs, so that the numerator is negative instead.

	- (void)normalize
	{
	    if (self.denominator < 0) {
	        self.numerator = -self.numerator;
	        self.denominator = -self.denominator;
	    }
	}

It's actually enough, if we only check for a negative denominator.

####Multiplication

Multiplication multiplies each of the numerators and denominators.

	+ (CRFraction*)fractionByMultiplying:(CRFraction*)op1 with:(CRFraction*)op2
	{
	    CRFraction* result = [[CRFraction alloc] init];
	    result.numerator = op1.numerator * op2.numerator;
	    result.denominator = op1.denominator * op2.denominator;
	    [result normalize];
	    return result;
	}

	- (CRFraction*)multiplyWithFraction:(CRFraction*)anotherFraction
	{
	    CRFraction* result = [CRFraction fractionByMultiplying:self
	                                                      with:anotherFraction];
	    [self copyValuesFromFraction:result];
	    return self;
	}

####Division

Division between fractions is solved using one fractions reciprocal(reverse) and multiply the fractions.

	+ (CRFraction*)fractionByDividing:(CRFraction*)op1 by:(CRFraction*)op2
	{
	    // reciprocal or reverse fraction
	    CRFraction* temp = [[CRFraction alloc] initWithNumerator:op2.denominator
	                                             withDenominator:op2.numerator];
	    CRFraction* result = [CRFraction fractionByMultiplying:op1
	                                                      with:temp];
	    return result;
	}

	- (CRFraction*)divideWithFraction:(CRFraction*)anotherFraction
	{
	    CRFraction* result = [CRFraction fractionByDividing:self
	                                                     by:anotherFraction];
	    [self copyValuesFromFraction:result];
	    return self;
	}


####Showtime

To test this out, we can now create some fractions and change their values. First of, let's add a convenient initializer function for our fractions

	- initWithNumerator:(NSInteger)num withDenominator:(NSInteger)denom
	{
	    self = [super init];
	    if (self) {
	        self.numerator = num;
	        self.denominator = denom;
	    }
	    return self;
	}

Now, we can test it out in the application:didFinishLaunchingWithOptions:

    [self.window makeKeyAndVisible];

    CRFraction* fracA = [[CRFraction alloc] initWithNumerator:1
                                              withDenominator:4]; // 1/4

    CRFraction* fracB = [[CRFraction alloc] initWithNumerator:1
                                              withDenominator:3]; // 1/3
    CRFraction* result = [CRFraction fractionByAdding: frac1 to: frac2];

    NSLog(@" 1/4 - 1/3 = %i/%i", result.numerator, result.denominator);

    return YES;
}

 	>> 1/4 + 1/3 = 7/12

Go ahead and try out all of the functions, if you like.

In the next part I will extend the logic with decimals, mixed fractions, and gcd - the greatest common divider.




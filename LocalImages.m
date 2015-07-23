//
//  LocalImages.m
//  hpPhotosIOS
//
//  Created by Jason Meistrich on 7/23/15.
//

#import "LocalImages.h"

@implementation LocalImages

RCT_EXPORT_METHOD(saveImage:(NSString *)url id:(NSString *)id callback:(RCTResponseSenderBlock)callback)
{
  NSString * documentsDirectoryPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
  NSString *imgName = [id stringByAppendingString:@".png"];
  NSString *imgURL = url;
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *writablePath = [documentsDirectoryPath stringByAppendingPathComponent:imgName];
  
  if(![fileManager fileExistsAtPath:writablePath]){
    // file doesn't exist
    NSLog(@"file doesn't exist");
    if (imgName) {
      //save Image From URL
      [self getImageFromURLAndSaveItToLocalData:imgName fileURL:imgURL inDirectory:documentsDirectoryPath];
      callback(@[[NSNull null], [NSNull null]]);
    }
  }
  else{
    // file exist
    NSLog(@"file exist");
    callback(@[[NSNull null], [NSNull null]]);
  }
}

RCT_EXPORT_METHOD(getImage:(NSString *)id callback:(RCTResponseSenderBlock)callback)
{
  NSString * documentsDirectoryPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
  NSString *imgName = [id stringByAppendingString:@".png"];
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *path = [documentsDirectoryPath stringByAppendingPathComponent:imgName];
  
  
  
  if([fileManager fileExistsAtPath:path]){
    NSData *data = [NSData dataWithContentsOfFile:path];
    NSString *str = [data base64EncodedStringWithOptions:0];
    
    callback(@[[NSNull null], str]);
  }
  else{
    // file exist
    NSLog(@"file does not exist");
  }
}

-(void) getImageFromURLAndSaveItToLocalData:(NSString *)imageName fileURL:(NSString *)fileURL inDirectory:(NSString *)directoryPath {
  NSData * data = [NSData dataWithContentsOfURL:[NSURL URLWithString:fileURL]];
  
  NSError *error = nil;
  [data writeToFile:[directoryPath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", imageName]] options:NSAtomicWrite error:&error];
  
  if (error) {
    NSLog(@"Error Writing File : %@",error);
  }else{
    NSLog(@"Image %@ Saved SuccessFully",imageName);
  }
}

RCT_EXPORT_MODULE();

@end

//
//  LocalImages.m
//  hpPhotosIOS
//
//  Created by Jason Meistrich on 7/23/15.
//

#import "LocalImages.h"

@implementation LocalImages

RCT_EXPORT_METHOD(clear)
{
    NSString * documentsDirectoryPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
  
    NSFileManager *fm = [NSFileManager defaultManager];
    NSError *error = nil;
    for (NSString *file in [fm contentsOfDirectoryAtPath:documentsDirectoryPath error:&error]) {
      BOOL success = [fm removeItemAtPath:[NSString stringWithFormat:@"%@/%@", documentsDirectoryPath, file] error:&error];
      if (!success || error) {
        // it failed.
        NSLog(@"Failed to delete %@", error);
      }
      else
      {
        NSLog(@"Deleted");
      }
    }
}

RCT_EXPORT_METHOD(saveImage:(NSString *)url id:(NSString *)id callback:(RCTResponseSenderBlock)callback)
{
  NSString * documentsDirectoryPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
  NSString *imgName = [id stringByAppendingString:@".png"];
  NSString *imgURL = url;
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *path = [documentsDirectoryPath stringByAppendingPathComponent:imgName];
  
  if(![fileManager fileExistsAtPath:path]){
    // file doesn't exist
    NSLog(@"file doesn't exist");
    if (imgName) {
      //save Image From URL
      [self getImageFromURLAndSaveItToLocalData:path fileURL:imgURL];
      callback(@[[NSNull null], path]);
    }
  }
  else{
    // file exist
    NSLog(@"file exist");
    callback(@[[NSNull null], path]);
  }
}

RCT_EXPORT_METHOD(imagePath:(NSString *)id callback:(RCTResponseSenderBlock)callback)
{
    NSString * documentsDirectoryPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    NSString *imgName = [id stringByAppendingString:@".png"];
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSString *path = [documentsDirectoryPath stringByAppendingPathComponent:imgName];
    
    if([fileManager fileExistsAtPath:path]){
        callback(@[[NSNull null], path]);
    }
    else {
        callback(@[[NSNull null], [NSNull null]]);
    }
}

-(void) getImageFromURLAndSaveItToLocalData:(NSString *)path fileURL:(NSString *)fileURL {
  NSData * data = [NSData dataWithContentsOfURL:[NSURL URLWithString:fileURL]];
  
  NSError *error = nil;
  [data writeToFile:path options:NSAtomicWrite error:&error];
  
  if (error) {
    NSLog(@"Error Writing File : %@",error);
  }else{
    NSLog(@"Image %@ Saved SuccessFully",path);
  }
}

RCT_EXPORT_MODULE();

@end

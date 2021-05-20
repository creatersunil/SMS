// Configure the db URL and df api key
// used for login
// NOTE

// declare only constansts.




import {Injectable } from '@angular/core';


// Storage configuration

 const SCHOOL_KEY='school_key';
 const SCHOOL_NAME='school_name';
 const SCHOOL_CODE='school_code';
 const SCHOOL_ID='school_id';
 const MSDB_NAME='msdb_name';
 const MONGO_NAME='mongo_name';
 const ACCESS_VIEWS='access';
 const GROUP_NAME='group_name';
 const SESSION='session';
 const FILES='files';
 const PERMISSIONS='permissions';
 const USER_EMAIL='email';
 const REGISTRATIONID='registration_id';
 const DEFAULT_VIEW ='default_view';
 const MENUS='menus';
 const BASE_PATH ='base_path';
 const USER_FILES ='users';
 const ORG_LOGO ='logos';
 



@Injectable()
export class UserConfig {

/**
 * store session object
 * @param session 
 */
public setSession(session:any) { localStorage.setItem(SESSION,session);}
public getSession():any{return localStorage.getItem(SESSION);}
/**
 * store school name
 * @param name 
 */
public setSchoolName(name:any) { localStorage.setItem(SCHOOL_NAME,name)};
public getSchoolName():any{return localStorage.getItem(SCHOOL_NAME);}

/**
 * store school code
 * @param code 
 */
public setSchoolCode(code:any) { localStorage.setItem(SCHOOL_CODE,code)};
public getSchoolCode():any{return localStorage.getItem(SCHOOL_CODE);}

/**
 * store school id
 * @param id 
 */

public setSchoolId(id:any) { localStorage.setItem(SCHOOL_ID,id)};
public getSchoolId():any{return localStorage.getItem(SCHOOL_ID);}



/**
 * store user SCHOOL_KEY
 * @param key 
 */
public setSchoolKey(key:any) { localStorage.setItem(SCHOOL_KEY,key)};
public getSchoolKey():any{return localStorage.getItem(SCHOOL_KEY);}
/**
 * set mysql db service name
 * @param db 
 */
public setMsDbName(db:any) { localStorage.setItem(MSDB_NAME,db)};
public getMsDbName():any{return localStorage.getItem(MSDB_NAME);}
/**
 * set Mongo db service name
 * @param db 
 */
public setMongoName(db:any) { localStorage.setItem(MONGO_NAME,db)};
public getMongoName():any{return localStorage.getItem(MONGO_NAME);}
/**
 * set user access permissions
 * @param view_access 
 */
public setAccess(view_access:any) { localStorage.setItem(ACCESS_VIEWS,JSON.stringify(view_access))};
public getAccess():any{return JSON.parse(localStorage.getItem(ACCESS_VIEWS));}

/**
 * set user access group name
 * @param group_name 
 */
public setGroupName(group_name:any) { localStorage.setItem(GROUP_NAME,group_name)};
public getGroupName():any{return localStorage.getItem(GROUP_NAME);}

/**
 * store default view of the page.
 * @param view 
 */

public setDefaultView(view:any) { localStorage.setItem(DEFAULT_VIEW,view)};
public getDefaultView():any{return localStorage.getItem(DEFAULT_VIEW);}

/**
 * 
 * @param files 
 */
public setFiles(files:any) { localStorage.setItem(FILES,files)};
public getFiles():any{return localStorage.getItem(FILES);}
/**
 * 
 * @param permission 
 */
public setPermission(permission:any) { localStorage.setItem(PERMISSIONS,permission)};
public getPermission():any{return localStorage.getItem(PERMISSIONS);}
/**
 * 
 * @param name 
 */
public setUserEmail(name:any) { localStorage.setItem(USER_EMAIL,name)};
public getUserEmail():any{return localStorage.getItem(USER_EMAIL);}
/**
 * 
 * @param regid 
 */
public setRegId(regid:any) { localStorage.setItem(REGISTRATIONID,regid)};
public getRegId():any{return localStorage.getItem(REGISTRATIONID);}


public setMenus(menus:any) { localStorage.setItem(MENUS,JSON.stringify(menus))};
public getMenus():any{return JSON.parse(localStorage.getItem(MENUS));}


/**
 * storing s3 bucket base path 
 * 
 */
public setBasePath(path:any) { localStorage.setItem(BASE_PATH,path)};
public getBasePath():any{return localStorage.getItem(BASE_PATH);}


 
public getUserFilePath():any{return USER_FILES;}
public getOrgLogoPath():any{return ORG_LOGO;}

public cleanUp(){

    localStorage.clear();

}

}




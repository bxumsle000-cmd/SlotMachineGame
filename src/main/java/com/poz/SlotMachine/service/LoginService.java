package com.poz.SlotMachine.service;

import com.poz.SlotMachine.exception.ApiException;
import com.poz.SlotMachine.model.Members;
import com.poz.SlotMachine.repository.MembersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final MembersRepository membersRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginService(MembersRepository membersRepository, PasswordEncoder passwordEncoder) {
        this.membersRepository = membersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public int checkUserID(String username,String password){
        // ① 只用帳號查。查不到時故意回和「密碼錯誤」一模一樣的訊息，
        //    否則攻擊者可從訊息差異列舉出哪些帳號存在（user enumeration）。
        Members userInfo = membersRepository.getUserInfoByName(username)
                .orElseThrow(()-> new ApiException(HttpStatus.UNAUTHORIZED, "帳號或密碼錯誤"));

        // ② 密碼比對交給 BCrypt。參數順序不可顛倒：
        //    第一個是使用者輸入的明文，第二個是資料庫裡的雜湊。
        //    matches() 會自行從雜湊字串中取出 salt 重算後比對。
        if(!passwordEncoder.matches(password, userInfo.password())){
            throw new ApiException(HttpStatus.UNAUTHORIZED, "帳號或密碼錯誤");
        }

        // ③ 停用狀態放在密碼驗證之後才檢查，
        //    否則沒有密碼的人也能問出某個帳號是否被停用。
        if(userInfo.status()!=1){
            throw new ApiException(HttpStatus.FORBIDDEN, "帳號已經停用");
        }
        return userInfo.id();
    }
}

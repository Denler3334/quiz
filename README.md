# quiz
Универсальный скрипт КВИЗа


 Подключение:
   1. Прописать тегу атрибут "data-quiz" c названием файла квиза
   2. Запустить $( ТЕГ ).Quiz([Опции]);
    
   Опции:
        Пример:
            $( ТЕГ ).Quiz({
                path : "/uploads/quizes/"
            });
        
        Список:
            path : '' // Директория с файлами
            ext : '.json', // Расширение файлов
            prefix : 'quiz_', // Префикс файлов
            attr : 'data-quiz', // Название атрибута
    
    События:
        Пример:
            $( ТЕГ ).Quiz({
                before_upload : function( data, callback ){
                    // data - входные данные
                    callback( true ); // Обратная функция
                }
            });
        
        Список:
            before_upload // Что то сделать перед загрузкой квиза
                - function( data, callback )
                
            after_upload // Что то сделать после загрузки файла
                - function( data )
                
            before_start // Что то сделать непосредственно перед запуском квиза
                - function( data, callback )
                
            required_error // Обязательный слайдер
                - function()
                
            view_forma // Показывает форму
                - function( formdata )
                
            view_slide // Показать пользовательский слайд
                - function( slide_data )
                
    Управляющие функции:
        [window.]QuizEvent[Название файла квиза ].next(); // Следующий слайд
        [window.]QuizEvent[Название файла квиза ].prev(); // Предыдущий слайд
        [window.]QuizEvent[Название файла квиза ].answer('ОТВЕТ'); // Установить ответ
        [window.]QuizEvent[Название файла квиза ].results; // Результаты квиза
        

http://camcam.titanweb.site/index2.php#

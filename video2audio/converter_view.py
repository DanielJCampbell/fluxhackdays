# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file '/users/danielcampbell/fluxhackdays/video2audio/converter_view.ui',
# licensing of '/users/danielcampbell/fluxhackdays/video2audio/converter_view.ui' applies.
#
# Created: Fri Jun 22 13:33:30 2018
#      by: pyside2-uic  running on PySide2 5.9.0a1
#
# WARNING! All changes made in this file will be lost!

from PySide2 import QtCore, QtGui, QtWidgets

class Ui_ConverterView(object):
    def setupUi(self, converter_view):
        converter_view.setObjectName("converter_view")
        converter_view.setGeometry(QtCore.QRect(0, 0, 800, 600))
        converter_view.setMinimumSize(QtCore.QSize(800, 600))
        self.main_layout = QtWidgets.QWidget(converter_view)
        self.main_layout.setObjectName("main_layout")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.main_layout)
        self.verticalLayout.setObjectName("verticalLayout")
        self.title_layout = QtWidgets.QVBoxLayout()
        self.title_layout.setSpacing(-1)
        self.title_layout.setSizeConstraint(QtWidgets.QLayout.SetMaximumSize)
        self.title_layout.setContentsMargins(0, -1, -1, -1)
        self.title_layout.setObjectName("title_layout")
        self.header_label = QtWidgets.QLabel(self.main_layout)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        sizePolicy.setHorizontalStretch(1)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.header_label.sizePolicy().hasHeightForWidth())
        self.header_label.setSizePolicy(sizePolicy)
        self.header_label.setMinimumSize(QtCore.QSize(800, 50))
        self.header_label.setMaximumSize(QtCore.QSize(16777215, 50))
        self.header_label.setSizeIncrement(QtCore.QSize(1, 0))
        font = QtGui.QFont()
        font.setPointSize(24)
        font.setWeight(75)
        font.setBold(True)
        self.header_label.setFont(font)
        self.header_label.setAlignment(QtCore.Qt.AlignCenter)
        self.header_label.setObjectName("header_label")
        self.title_layout.addWidget(self.header_label)
        self.verticalLayout.addLayout(self.title_layout)
        self.form_layout = QtWidgets.QVBoxLayout()
        self.form_layout.setObjectName("form_layout")
        self.add_line_button = QtWidgets.QPushButton(self.main_layout)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Maximum, QtWidgets.QSizePolicy.Fixed)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.add_line_button.sizePolicy().hasHeightForWidth())
        self.add_line_button.setSizePolicy(sizePolicy)
        self.add_line_button.setObjectName("add_line_button")
        self.form_layout.addWidget(self.add_line_button)
        self.verticalLayout.addLayout(self.form_layout)
        converter_view.setCentralWidget(self.main_layout)

        self.retranslateUi(converter_view)
        QtCore.QMetaObject.connectSlotsByName(converter_view)

    def retranslateUi(self, converter_view):
        converter_view.setWindowTitle(QtWidgets.QApplication.translate("ConverterView", "Video 2 Audio Converter", None, -1))
        self.header_label.setText(QtWidgets.QApplication.translate("ConverterView", "Video 2 Audio Converter", None, -1))
        self.add_line_button.setText(QtWidgets.QApplication.translate("ConverterView", "Add Video", None, -1))

